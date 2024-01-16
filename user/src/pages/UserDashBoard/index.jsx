import React from 'react';
import RequestStatus from '../../pages/RequestStatus';
import { useState, useEffect } from 'react';

const UserDashBoard = () => {
  const [S_EID, setEID] = useState('');

  useEffect(() => {
    var x = localStorage.getItem('tokenID');
    try {
      console.log('userdahboard token read from localStorage : ' + x);
      fetch('/user/dashboard/requestform', {
        method: 'GET',
        headers: {
          token: x,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }).then(response => {
        response.json().then(response => {
          console.log(response);
          setEID(response.EID);
        });
      });
    } catch (err) {
      console.log('Error occured ');
      console.log(err);
    }
  }, []);

  return (
    <div>
      <RequestStatus eid={S_EID} />
    </div>
  );
};
export default UserDashBoard;
