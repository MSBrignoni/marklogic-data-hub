import React, {useContext} from "react";
import {Spin} from "antd";
import {UserContext} from "../../util/user-context";
import {SearchContext} from "../../util/search-context";
import HCAlert from "../common/hc-alert/hc-alert";

const AsyncLoader: React.FC = () => {
  const {user, clearErrorMessage} = useContext(UserContext);
  const {resetSearchOptions} = useContext(SearchContext);

  const onClose = () => {
    clearErrorMessage();
    resetSearchOptions();
  };

  return (
    <>
      {user.error.type === "ALERT" ?
        <HCAlert variant="danger" dismissible data-cy="alert-error-message" heading={user.error.title} onClose={onClose}>
          {user.error.message}
        </HCAlert>
        :
        <Spin data-testid="spinner" tip="Loading..." style={{margin: "100px auto", width: "100%"}} />
      }
    </>
  );
};

export default AsyncLoader;
