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
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import Spinner from "../components/Spinner";
import { cAxios, LogOps, UserType } from "../constants";

function Item({
  user,
  isPending,
  acceptUser = undefined,
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
            <Col md className="d-flex align-items-center" style={{ fontSize: ".8rem" }}>
              {user.email}
            </Col>
            
            <Col md className="d-flex align-items-center" style={{ fontSize: ".8rem" }} >
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
        <Col md className="d-flex align-items-center" style={{ fontSize: ".8rem" }} >
          {new Date(user.createdAt).toLocaleString()}
        </Col>

        <Col md className="d-flex align-items-center">
          {isPending ? (
            <>
              <Button
                variant="outline-success"
                size="sm"
                className="mx-2"
                onClick={() => acceptUser(user)}
              >
                <TiTick />
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
        {log.operation === LogOps.CREATE ? (
          <span className="bg-success text-light rounded-circle p-1">
            <MdOutlineNoteAdd />
          </span>
        ) : log.operation === LogOps.UPDATE ? (
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
        <span className="text-secondary">@</span>
        {log.username}
      </span>
      <span style={{ fontSize: "0.8rem", textAlign: "right" }} className="w-50">
        {log.datetime}
      </span>
    </div>
  );
}

export default function Dashboard() {
  const [pending, setPending] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      cAxios.get("/users/0").then((res) => {
        if (res.data.status === 200) {
          setPending(res.data.users);
        }
      }),
      cAxios.get("/users/1").then((res) => {
        if (res.data.status === 200) {
          setUsers(res.data.users);
        }
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

  const acceptUser = useCallback((u) => {
    cAxios.post(`/user/accept/${u.id}`).then((res) => {
      if (res.data.status === 200) {
        setPending((prev) => prev.filter((_u) => _u.id !== u.id));
        setUsers((prev) => [u, ...prev]);
      }
    });
  }, []);

  const promoteUser = useCallback((u, p) => {
    cAxios.post(`/user/promote/${u.id}/${p}`).then((res) => {
      if (res.data.status === 200) {
        setUsers((prev) => {
          const result = [...prev];
          const uidx = result.findIndex((_u) => _u.id === u.id);
          result[uidx].type = res.data.type;
          return result;
        });
      }
    });
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Container className="mb-5">
      <Row className="mt-5 mb-5 text-center">
        <p style={{ fontSize: "1.5rem" }}>
          <GrUserAdmin /> &nbsp;DASHBOARD
        </p>
      </Row>
      <Row>
        <Col xl={8}>
          <Accordion
            defaultActiveKey="0"
            className="mb-4"
          >
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <MdPendingActions /> &nbsp;Pending
              </Accordion.Header>
              <Accordion.Body>
                {pending.map((u) => (
                  <Item
                    key={u.id}
                    user={u}
                    isPending={true}
                    acceptUser={acceptUser}
                  />
                ))}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
        <Col sm>
          <Accordion
            defaultActiveKey={"0"}
            className="mb-4"
          >
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <BiBookAlt /> &nbsp;Logs
              </Accordion.Header>
              <Accordion.Body>
                {[
                  {
                    datetime: "06/Mar/2023 16:19:15",
                    username: "john",
                    operation: "CREATE",
                  },
                  {
                    datetime: "06/Mar/2023 16:19:16",
                    username: "james",
                    operation: "UPDATE",
                  },
                  {
                    datetime: "06/Mar/2023 16:19:17",
                    username: "jim",
                    operation: "DELETE",
                  },
                ].map((l) => (
                  <Log key={l.datetime} log={l} />
                ))}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
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
