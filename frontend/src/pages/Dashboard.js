import { useCallback, useContext, useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/esm/Button";
import { AiOutlineDelete, AiOutlineUser } from "react-icons/ai";
import { BiBookAlt, BiUserPin } from "react-icons/bi";
import { FiEdit2 } from "react-icons/fi";
import { GrUserAdmin } from "react-icons/gr";
import {
  HiOutlineChevronDoubleDown,
  HiOutlineChevronDoubleUp,
} from "react-icons/hi";
import { MdPendingActions, MdOutlineNoteAdd } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";
import { TiTick } from "react-icons/ti";
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import Spinner from "../components/Spinner";
import { cAxios, LogType, UserType } from "../constants";

function Item({
  user,
  isPending,
  confirmUser = undefined,
  promoteUser = undefined,
}) {
  const { user: authUser } = useContext(AuthContext);
  return (
    <Container className="my-2">
      <Row>
        <Col md>
          <img
            src="/noImg.webp"
            alt={"User-Avatar"}
            className="p-1 rounded-circle"
            style={{
              border: "1px solid rgb(200, 200, 200)",
              width: "40px",
              heigth: "40px",
            }}
          />
          <span
            className="mx-2"
            style={{
              fontSize: "0.8rem",
            }}
          >
            @{user.username}
          </span>
        </Col>
        {!isPending && (
          <>
            <Col
              md
              className="d-flex align-items-center"
              style={{ fontSize: ".8rem" }}
            >
              {user.email}
            </Col>

            <Col
              md
              className="d-flex align-items-center"
              style={{ fontSize: ".8rem" }}
            >
              {user.type === UserType.ADMINISTRATOR ? (
                <GrUserAdmin />
              ) : user.type === UserType.MODERATOR ? (
                <RiAdminLine />
              ) : (
                <AiOutlineUser />
              )}
              &nbsp;&nbsp;{user.type}
            </Col>
          </>
        )}
        <Col
          md
          className="d-flex align-items-center"
          style={{ fontSize: ".8rem" }}
        >
          {new Date(user.createdAt).toLocaleString()}
        </Col>

        <Col md className="d-flex align-items-center justify-content-end">
          {isPending ? (
            <>
              <Button
                variant="outline-success"
                size="sm"
                className="mx-2"
                onClick={() => confirmUser(user, 1)}
              >
                <TiTick />
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => confirmUser(user, 0)}
              >
                <RxCross1 />
              </Button>
            </>
          ) : (
            user.id !== authUser.id && (
              <>
                {user.type !== UserType.ADMINISTRATOR && (
                  <Button
                    variant="outline-success"
                    size="sm"
                    className="ms-auto"
                    onClick={() => promoteUser(user, 1)}
                  >
                    <HiOutlineChevronDoubleUp />
                  </Button>
                )}
                {user.type !== UserType.MEMBER && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="ms-2"
                    onClick={() => promoteUser(user, 0)}
                  >
                    <HiOutlineChevronDoubleDown />
                  </Button>
                )}
              </>
            )
          )}
        </Col>
      </Row>
    </Container>
  );
}

function Log({ log }) {
  return (
    <div className="d-flex justify-content-between align-items-center m-3">
      <span className="w-25" style={{ fontSize: ".8rem" }}>
        {log.type === LogType.CREATE ? (
          <span className="bg-success text-light rounded-circle p-1">
            <MdOutlineNoteAdd />
          </span>
        ) : log.type === LogType.UPDATE ? (
          <span className="bg-warning text-light rounded-circle p-1">
            <FiEdit2 />
          </span>
        ) : (
          <span className="bg-danger text-light rounded-circle p-1">
            <AiOutlineDelete />
          </span>
        )}
      </span>
      <span className="w-25" style={{ fontSize: ".8rem" }}>
        <span className="text-secondary">
          {log.user.type === UserType.ADMINISTRATOR ? (
            <GrUserAdmin />
          ) : log.user.type === UserType.MODERATOR ? (
            <RiAdminLine />
          ) : (
            <AiOutlineUser />
          )}{" "}
          &nbsp;
        </span>
        {log.user.username}
      </span>
      <span style={{ fontSize: "0.8rem", textAlign: "right" }} className="w-50">
        {new Date(log.createdAt).toLocaleString()}
      </span>
    </div>
  );
}

export default function Dashboard() {
  const [pending, setPending] = useState([]);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      cAxios.get("/users/0").then((res) => {
        setPending(res.data);
      }),
      cAxios.get("/users/1").then((res) => {
        setUsers(res.data);
      }),
      cAxios.get("/logs").then((res) => {
        setLogs(res.data);
      }),
    ]).then(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (user.type !== UserType.ADMINISTRATOR) {
      navigate("/");
    }
  }, [user, navigate]);

  const confirmUser = useCallback((u, accept) => {
    cAxios.post(`/user/confirm`, { uid: u.id, accept }).then(() => {
      setPending((prev) => prev.filter((_u) => _u.id !== u.id));
      if (accept === 1) {
        setUsers((prev) => [u, ...prev]);
      }
    });
  }, []);

  const promoteUser = useCallback((u, p) => {
    cAxios.post(`/user/promote/${u.id}/${p}`).then((res) => {
      setUsers((prev) => {
        const result = [...prev];
        const uidx = result.findIndex((_u) => _u.id === u.id);
        result[uidx].type = res.data.type;
        return result;
      });
    });
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Container className="mb-5">
      <Row className="mt-5">
        <div className="d-flex">
          <GrUserAdmin className="display-5" />&nbsp;&nbsp;
          <h1>Dashboard</h1>
        </div>
        <p className="lead">Hello, {user.username}</p>
      </Row>
      <Row>
        <Accordion defaultActiveKey="0" className="mb-4">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <MdPendingActions /> &nbsp;Pending
            </Accordion.Header>
            <Accordion.Body>
              {(pending.length > 0) ? (pending.map((u) => (
                <Item
                  key={u.id}
                  user={u}
                  isPending={true}
                  confirmUser={confirmUser}
                />
              ))) : (
                <div className="text-center">
                  No registrations pending approval.
                </div>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Row>
      <Row>
        <Accordion defaultActiveKey={"0"} className="mb-4">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <BiBookAlt /> &nbsp;Logs
            </Accordion.Header>
            <Accordion.Body>
              {(logs.length > 0) ? (logs.map((l) => (
                <Log key={l.id} log={l} />
              ))) : (
                <div className="text-center">
                  No logs to view.
                </div>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Row>
      <Row>
        <Accordion className="mb-4" defaultActiveKey={"0"}>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <BiUserPin /> &nbsp;Users
            </Accordion.Header>
            <Accordion.Body>
              {users.map((u) => (
                <Item
                  key={u.id}
                  user={u}
                  isPending={false}
                  promoteUser={promoteUser}
                />
              ))}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Row>
    </Container>
  );
}
