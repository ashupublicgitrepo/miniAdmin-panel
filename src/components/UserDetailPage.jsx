import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styles/TableStyles.css";
import FakeUsers from "./FakeUsers";

const UserDetailPage = () => {
  const { userStates } = useOutletContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const targetId = Number(id);
  const user = userFinder();
  const [comment, setComment] = useState({
    phase: null,
    targetId: null,
    comments: [],
    error: null,
  });
  const commentRef = useRef();
  const [userPosts, setUserPosts] = useState({
    phase: "idle",
    error: null,
    post: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = userPosts.post.length;
  const itemsPerPage = 2;
  const maxPage = Math.ceil(totalItems / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const end = currentPage * itemsPerPage;
  const visibleUsers = userPosts.post.slice(start, end);
  function userFinder() {
    const user = userStates.data.find((u) => u.id === targetId);
    if (user) return user;
  }
  function userPresentConfirmer(page) {
    return userStates.data.some((u) => u.id === page);
  }
  function previousUserConfirmer(page) {
    return userStates.data.some((u) => u.id < page);
  }
  function nextUserConfirmer(page) {
    return userStates.data.some((u) => u.id > page);
  }
  function nextUserFinder(page) {
    return userStates.data.find((u) => u.id > page);
  }
  function previousUserFinder(page) {
    return userStates.data.findLast((u) => u.id < page);
  }
  function navigator(page) {
    const userPresent = userPresentConfirmer(page);
    if (userPresent) return navigate(`/userDetail/${page}`);
    if (targetId < page) {
      const nextPresent = nextUserFinder(page);
      navigate(`/userDetail/${nextPresent.id}`);
    }
    if (targetId > page) {
      const previousPresent = previousUserFinder(page);
      navigate(`/userDetail/${previousPresent.id}`);
    }
  }
  function pageSetter(page) {
    setCurrentPage((pr) => {
      if (page === "next") {
        if (pr < maxPage) return pr + 1;
        return pr;
      }
      if (page === "previous") {
        if (pr > 1) return pr - 1;
        return pr;
      }
    });
  }

  function updateState(newState) {
    setUserPosts((pr) => ({ ...pr, ...newState }));
  }
  function userPostFetcher() {
    updateState({ phase: "loading" });
    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${targetId}`)
      .then((res) => {
        if (!res.ok)
          throw new Error(`server failed to fetch! status: ${res.status}`);
        else return res.json();
      })
      .then((json) => {
        updateState({ post: json, phase: "idle", error: null });
      })
      .catch((err) =>
        updateState({ phase: "error", post: [], error: err.message }),
      );
  }

  function commentFetcher(id) {
    if (comment.phase === "loading") return false;
    setComment((pr) => {
      if (pr.targetId === id) {
        return {
          ...pr,
          targetId: null,
          comments: [],
          error: null,
          phase: "idle",
        };
      }
      return { ...pr, phase: "loading", comments: [], targetId: id };
    });
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments?_limit=10`)
      .then((res) => {
        if (!res.ok)
          throw new Error(`server failed to fetch! status: ${res.status}`);
        return res.json();
      })
      .then((json) =>
        setComment((pr) => ({
          ...pr,
          phase: "idle",
          error: null,
          comments: json,
        })),
      )
      .catch((err) =>
        setComment((pr) => ({
          ...pr,
          targetId: id,
          comments: [],
          phase: "error",
          error: err.message,
        })),
      );
  }
  useEffect(() => {
    if (targetId) userPostFetcher();
    setCurrentPage(1);
  }, [targetId]);

  function handleCommentSubmit(e, uId) {
    e.preventDefault();
    const val = commentRef.current.value;
    if (!val.trim()) return false;
    const postCom = {
      postId: uId,
      email: "local@client.dev",
      id: Date.now(),
      name: "dev.localUser",
      body: val,
    };

    setComment((pr) => {
      const newCommentList = [postCom, ...pr.comments];
      return { ...pr, comments: newCommentList };
    });
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(postCom),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .catch((err) =>
        setComment((pr) => ({ ...pr, status: "error", errorMsg: err })),
      );

    commentRef.current.value = null;
  }
  return (
    <>
      <Link to="/" className="linkDecorate">
        <button>back</button>
      </Link>
      {!user ? (
        <p>user not found</p>
      ) : (
        <>
          <div className="userDetail">
            <div id="userDetailDiv">
              <p className="user-info">{user.name}</p>
              <p className="user-info">Email : {user.email}</p>
              <p className="user-info">Phone : {user.phone}</p>
              <p className="user-info">Website : {user.website}</p>
              <p className="user-info">Company : {user.company.name}</p>
              <p className="user-info">Address : {user.address.street}</p>
              <div style={{ textAlign: "center" }}>
                {previousUserConfirmer(targetId) && (
                  <button onClick={() => navigator(targetId - 1)}>
                    previous user
                  </button>
                )}
                {nextUserConfirmer(targetId) && (
                  <button onClick={() => navigator(targetId + 1)}>
                    next user
                  </button>
                )}
              </div>
            </div>
            <div className="userpost-div">
              <h3>user posts</h3>

              {currentPage > 1 && (
                <button onClick={() => pageSetter("previous")}>previous</button>
              )}
              {userPosts.phase === "loading" ? (
                <div>
                  <p>...loading</p>
                  <FakeUsers />
                </div>
              ) : userPosts.phase === "error" ? (
                <div>
                  <p>{userPosts.error}</p>
                  <button onClick={userPostFetcher}>retry</button>
                </div>
              ) : (
                visibleUsers.map((d) => {
                  return (
                    <div key={d.id}>
                      <h4 className="user-postTitle">{d.title}</h4>
                      <p className="userposts">{d.body}</p>
                      <p
                        id="commentButton"
                        onClick={() => commentFetcher(d.id)}
                      >
                        comments
                      </p>
                      {comment.targetId === d.id && (
                        <div>
                          {comment.phase === "loading" ? (
                            <div>
                              <p>...loading</p>
                              <FakeUsers />
                            </div>
                          ) : comment.phase === "error" ? (
                            <div>
                              <p>{comment.error}</p>
                              <button onClick={() => commentFetcher(d.id)}>
                                retry
                              </button>
                            </div>
                          ) : (
                            <div>
                              <div>
                                <form
                                  action=""
                                  onSubmit={(e) => handleCommentSubmit(e, d.id)}
                                >
                                  <input type="text" ref={commentRef} />
                                  <button>post</button>
                                </form>
                              </div>
                              {comment.comments.map((e) => (
                                <div key={e.id}>
                                  <div className="commenterDiv">
                                    <div id="commenterInfo">
                                      <div className="userThumb"></div>
                                      <h5>{e.email}</h5>
                                    </div>
                                    <h4>{e.name}</h4>
                                    <p>{e.body}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              {currentPage < maxPage ? (
                <button onClick={() => pageSetter("next")}>next</button>
              ) : (
                <p>this is last page</p>
              )}
              <p>page {currentPage}</p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UserDetailPage;
