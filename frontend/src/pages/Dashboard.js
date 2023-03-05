import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { cAxios, UserType } from "../constants";
import Accordion from "react-bootstrap/Accordion";
import { MdPendingActions } from "react-icons/md";
import { BiUserPin, BiBookAlt } from "react-icons/bi";
import Button from "react-bootstrap/esm/Button";
import { TiTick } from "react-icons/ti";
import { AiOutlineClose } from "react-icons/ai";
import { GrUserAdmin } from "react-icons/gr";
import { RiAdminLine } from "react-icons/ri";
import { AiOutlineUser } from "react-icons/ai";
import {
  HiOutlineChevronDoubleUp,
  HiOutlineChevronDoubleDown,
} from "react-icons/hi";

function Item({ user, isPending }) {
  return (
    <div
      key={user.id}
      className="d-flex justify-content-between align-items-center m-2"
    >
      <div className="w-25">
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
      </div>
      <div style={{ fontSize: "0.8rem" }}>
        {user.type === UserType.ADMINISTRATOR ? (
          <GrUserAdmin />
        ) : user.type === UserType.MODERATOR ? (
          <RiAdminLine />
        ) : (
          <AiOutlineUser />
        )}
        &nbsp;&nbsp;{user.type}
      </div>

      <div>
        {isPending ? (
          <>
            <Button variant="outline-success" size="sm" className="mx-2">
              <TiTick />
            </Button>
            <Button variant="outline-danger" size="sm">
              <AiOutlineClose />
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline-success" size="sm" className="mx-2">
              <HiOutlineChevronDoubleUp />
            </Button>
            <Button variant="outline-danger" size="sm">
              <HiOutlineChevronDoubleDown />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [pending, setPending] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    cAxios.get("/users/0").then((res) => {
      if (res.data.status === 200) {
        setPending(res.data.users);
      }
    });
    cAxios.get("/users/1").then((res) => {
      if (res.data.status === 200) {
        setUsers(res.data.users);
      }
    });
  }, []);

  return (
    <Container>
      <Row className="mt-5 mb-5 text-center">
        <p className="display-6">DASHBOARD</p>
      </Row>
      <Row>
        <div className="d-flex">
          <div className="w-75 mx-4">
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <MdPendingActions /> &nbsp;Pending
                </Accordion.Header>
                <Accordion.Body>
                  {pending.map((u) => (
                    <Item key={u.id} user={u} isPending={true} />
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <Accordion className="mt-5">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <BiUserPin /> &nbsp;Users
                </Accordion.Header>
                <Accordion.Body>
                  {users.map((u) => (
                    <Item key={u.id} user={u} isPending={false} />
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
          <div className="w-25">
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <BiBookAlt /> &nbsp;Logs
                </Accordion.Header>
                <Accordion.Body>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      </Row>
    </Container>
  );
}
