import firebase from "firebase/compat/app";

const timestampToDaysHours = (timestamp: firebase.firestore.Timestamp): string => {
    const currentTimestamp = new Date();
    const postTimestamp = timestamp.toDate();
  
    const timeDifference = currentTimestamp.getTime() - postTimestamp.getTime();
    const hours = Math.floor(timeDifference / (60 * 60 * 1000));
  
    if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      const days = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
      return `${days} days ago`;
    }
  };

export default timestampToDaysHours;
