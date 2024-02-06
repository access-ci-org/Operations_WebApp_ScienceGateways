import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom/client";

export default function () {
    let [data, setData] = useState(null);

    async function fetchData() {
        let response = await fetch("https://operations-api.access-ci.org/wh2/cider/v1/access-science-gateways/")
            .then(res=> res.json())

        console.log("response : ", response);
        setData(response.results);
    }

    useEffect(() => {
        fetchData();
    }, []);



    if (!data) {
        return <div>Loading...</div>
    } else if (data.length === 0) {
        return <div>No science gateways available to display.</div>
    } else {
        return <div className="w-100">
            <ul className="row list-unstyled">
                {data.map((gateway, gatewayIndex) => {
                    // return <li key={gatewayIndex} className="col-lg-3">
                    //     <div className="bg-dark m-2">
                    //         <h3>{gateway.resource_descriptive_name}</h3>
                    //         <p>{gateway.resource_descriptive}</p>
                    //     </div>
                    // </li>

                    return <div className="m-2 w-100">
                        <div className="bg-dark text-light p-5 h-100">
                            <h3>
                                {gateway.resource_descriptive_name}&nbsp;&nbsp;
                                <span className="badge bg-medium text-light">{gateway.shortname}</span>
                            </h3>
                            <p>{gateway.resource_description}</p>
                            {/*<p>{gateway.long_description}</p>*/}
                            <div className="d-flex flex-row">
                                <div className="p-1">
                                    <strong>Allocation Grant No. : </strong>
                                    {gateway.allocated_grant_number}
                                </div>
                                <div className="p-1">
                                    <strong>Status : </strong>
                                    {gateway.latest_status}
                                </div>
                            </div>
                            <div className="pt-3">
                                <h4>
                                    Links
                                </h4>
                                <p>
                                    <a className="btn btn-link pb-3" href={gateway.primary_service_url}>Primary Service URL</a>
                                    <a className="btn btn-link pb-3" href={gateway.cider_data_url}>CiDer Data URL</a>
                                </p>
                            </div>
                        </div>
                    </div>
                })}
            </ul>
        </div>
    }
}

