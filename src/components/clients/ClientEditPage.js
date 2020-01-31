import React from 'react';

export default function ClientEditPage(props) {
    console.log(props);
    return (
        <div>
            <h3> - Client Edit Page </h3>
            <div> {props.match.params.id} </div>
        </div>
    );
}
