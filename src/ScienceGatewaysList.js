import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom/client";

export default function () {
    let [data, setData] = useState(null);
    let [search, setSearch] = useState(null);
    let [page, setPage] = useState(1);
    let [pageSize, setPageSize] = useState(20);
    let [count, setCount] = useState(null);
    let [prev, setPrev] = useState(null);
    let [next, setNext] = useState(null);

    async function fetchData() {
        let query = [];
        if (search) {
            query.push(`search=${search}`);
        }

        if (page) {
            query.push(`page=${page}`);
        }

        if (pageSize) {
            query.push(`page_size=${pageSize}`);
        }

        query = query.join("&");

        let response = await fetch(
            `https://operations-api.access-ci.org/wh2/cider/v1/access-science-gateways/?${query}`)
            .then(res => res.json())

        console.log("response : ", response);
        setCount(response.count);
        setPrev(response.prev);
        setNext(response.next);
        setData(response.results);
    }

    function handleSearchChange(e) {
        console.log("handleSearchChange ", e.target.value);
        // setSearch(e.target.value);
    }

    function handleSearchKeyDown(e) {
        if (e.key == "Enter") {
            console.log("handleSearchKeyDown Enter");
            // fetchData();
            setSearch(e.target.value);
        }
    }

    function getPaginationData() {
        let paginationData = [];
        let lastPage = Math.ceil(count / pageSize);

        paginationData.push({
            label: "Prev",
            page: page - 1,
            disabled: page === 1
        });

        for (let i = 1; i <= lastPage; i++) {
            paginationData.push({
                label: i,
                page: i,
                active: i === page
            });
        }

        paginationData.push({
            label: "Next",
            page: page - 1,
            disabled: page === lastPage
        });

        return paginationData;
    }

    function handlePaginationLinkClick(page, e) {
        e.preventDefault();
        setPage(page);
    }

    useEffect(() => {
        fetchData();
    }, [search, page, pageSize]);

    function getGatewayList() {
        if (!data) {
            return <div className="p-3 text-center">Loading...</div>
        } else if (data.length === 0) {
            return <div className="p-3 text-center">No science gateways available to display.</div>
        } else {
            return <ul className="row list-unstyled">
                {data.map((gateway, gatewayIndex) => {
                    return <div className="m-2 w-100" key={gatewayIndex}>
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
                <nav className="w-100">
                  <ul className="pagination">
                      {getPaginationData().map(({page, label, active, disabled}, paginationLinkIndex) => {
                          return <li className="page-item" key={paginationLinkIndex}>
                              <a className={"page-link" + (active ? " active" : "") + (disabled ? " disabled" : "")} href="#"
                                 onClick={handlePaginationLinkClick.bind(this, page)}>{label}</a>
                          </li>
                      })}
                  </ul>
                </nav>
            </ul>
        }
    }

    return <div className="w-100 p-2 ">
        <h2>Science Gateway Discovery Interface</h2>
        <div className="w-100 p-3">
            <input type="text" className="form-control" placeholder="Search" onChange={handleSearchChange.bind(this)}
                   onKeyDown={handleSearchKeyDown.bind(this)}/>
        </div>
        {getGatewayList()}
    </div>

}

