import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom/client";

export default function () {
    let [data, setData] = useState(null);

    async function fetchData() {
        let response = await fetch("https://operations-api.access-ci.org/wh2/cider/v1/access-science-gateways/")
            .then(res => res.json())

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
        return <div className="w-100 p-2 ">
            <h2>Science Gateway Discovery Interface</h2>
            <ul className="row list-unstyled">
                {data.map((gateway, gatewayIndex) => {
                    // return <li key={gatewayIndex} className="col-lg-3">
                    //     <div className="bg-dark m-2">
                    //         <h3>{gateway.resource_descriptive_name}</h3>
                    //         <p>{gateway.resource_descriptive}</p>
                    //     </div>
                    // </li>

                    return <div className="m-2 w-100">
                        <div className="bg-light text-dark p-5 h-100">
                            <div className="d-lg-flex flex-lg-row d-sm-flex flex-sm-column">
                                <div className="flex-fill">
                                    <h2>
                                        <a className="btn btn-link">
                                            {gateway.resource_descriptive_name}
                                        </a>
                                    </h2>
                                </div>
                                <div>
                                    <span className="badge bg-dark text-light">{gateway.shortname}</span>
                                </div>
                            </div>

                            <p>{gateway.resource_description}</p>
                            {/*<p>{gateway.long_description}</p>*/}
                            <div className="w-100">
                                <div className="p-1">
                                    <strong>Status : </strong>
                                    {gateway.latest_status}
                                </div>
                                <div className="p-1">
                                    <strong>Allocation Grant No. : </strong>
                                    {gateway.allocated_grant_number}
                                </div>
                            </div>
                            <div className="pt-3">
                                <h4 className="visually-hidden">
                                    Links
                                </h4>
                                <ul className="w-100 list-unstyled list-inline">
                                    <li className="d-inline p-2">
                                        <a className="btn btn-link pb-3" href={gateway.primary_service_url}>Go to
                                            gateway</a>
                                    </li>
                                    <li className="d-inline p-2">
                                        <a className="btn btn-link pb-3" href={gateway.cider_data_url}>Gateway
                                            metadata</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                })}
            </ul>
        </div>
    }
}

