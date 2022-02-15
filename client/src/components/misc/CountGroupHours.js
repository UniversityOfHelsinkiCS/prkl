import React from 'react';


const CountGroupHours = ({
    times,
    students,
  }) => {

  let counter = 0;

  if (times) {
    times.forEach(element => {
        element.forEach(t => {
            if(t === students){
                counter+=1;
            }
        });
    });
  }

  if (counter===0) {
      return null;
    }
  return (
    <>
      <h3>YHTEISET TUNNIT NÄKYY, {counter} /50 </h3>
    </>
  );
};

export default CountGroupHours;
