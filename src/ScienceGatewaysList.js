import React, {useEffect, useState} from "react";

export default function () {
    let [data, setData] = useState(null);
    let [search, setSearch] = useState(null);
    let [page, setPage] = useState(1);
    let [pageSize, setPageSize] = useState(20);
    let [count, setCount] = useState(null);
    let [updated, setUpdated] = useState(false);

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

        setCount(response.count);
        setData(response.results);
    }

    function handleSearchChange(e) {
        setSearch(e.target.value);
    }

    function handleSearchKeyDown(e) {
        if (e.key == "Enter") {
            triggerSearch();
        }
    }

    function triggerSearch(e) {
        setPage(1);
        setUpdated(false);
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
            page: page + 1,
            disabled: page === lastPage
        });

        return paginationData;
    }

    function handlePaginationLinkClick(page, e) {
        e.preventDefault();
        setPage(page);
        setUpdated(false);
    }

    function handlePagesizeChange(e) {
        setPageSize(e.target.value);
        setUpdated(false);
    }

    useEffect(() => {
        if (!updated) {
            fetchData();
            setUpdated(true);
        }
    }, [updated]);

    function getGatewayList() {
        if (!data) {
            return <div className="w-100 p-3 text-center">Loading...</div>
        } else if (data.length === 0) {
            return <div className="w-100 p-3 text-center">No science gateways available to display.</div>
        } else {
            return <ul className="row list-unstyled">
                <div className="d-flex flex-row">
                    <div style={{minWidth: "40px"}} className="d-flex flex-row">
                        <div className="p-1">
                            <label className="form-label" htmlFor="pageSizeDropdown">
                                Page size
                            </label>
                        </div>
                        <div>
                            <select className="form-select" id="pageSizeDropdown" value={pageSize}
                                    onChange={handlePagesizeChange.bind(this)} style={{width: "65px"}}>
                                <option>10</option>
                                <option>20</option>
                                <option>50</option>
                            </select>
                        </div>
                    </div>
                    <div className="ps-2 pe-3 pt-2 pb-2 text-end flex-fill">
                        Showing {data.length} result(s) of {count}.
                    </div>
                </div>
                {data.map((gateway, gatewayIndex) => {
                    return <div className="w-100 p-3" key={gatewayIndex}>
                        <div className="bg-light text-dark pt-3 pb-3 ps-4 pe-4 w-100">
                            <div className="d-lg-flex flex-lg-row d-sm-flex flex-sm-column">
                                <div className="flex-fill">
                                    <h2 className="w-100">
                                        {gateway.resource_descriptive_name}
                                        &nbsp;
                                        <small className="fs-6">({gateway.shortname})</small>
                                    </h2>
                                </div>
                            </div>

                            <p>{gateway.resource_description}</p>
                            {/*/!*<p>{gateway.long_description}</p>*!/*/}
                            {/*<ul className="w-100 list-inline list-unstyled">*/}
                            {/*    <li className="p-1 list-inline-item">*/}
                            {/*        <strong>Status : </strong>*/}
                            {/*        {gateway.latest_status}*/}
                            {/*    </li>*/}
                            {/*    <li className="p-1  list-inline-item">*/}
                            {/*        <strong>Allocation Grant No. : </strong>*/}
                            {/*        {gateway.allocated_grant_number}*/}
                            {/*    </li>*/}
                            {/*</ul>*/}


                            <div className="pt-3">
                                <h4 className="visually-hidden">
                                    Links
                                </h4>
                                <ul className="w-100 list-unstyled list-inline">
                                    <li className="d-inline">
                                        <a className="btn btn-link pe-2" href={gateway.primary_service_url}
                                           target="_blank">
                                            Go to gateway
                                        </a>
                                        <i className="bi bi-box-arrow-up-right"></i>
                                    </li>
                                    <li className="d-inline p-2">
                                        <a className="btn btn-link pe-2" href={gateway.sgx3_url} target="_blank">
                                            SGX3 Catalog
                                        </a>
                                        <i className="bi bi-box-arrow-up-right"></i>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                })}
                <div className="w-100 d-flex flex-row">
                    <nav className="flex-fill">
                        <ul className="pagination">
                            {getPaginationData().map(({page, label, active, disabled}, paginationLinkIndex) => {
                                return <li className="page-item" key={paginationLinkIndex}>
                                    <a className={"page-link" + (active ? " active" : "") + (disabled ? " disabled" : "")}
                                       href="#"
                                       onClick={handlePaginationLinkClick.bind(this, page)}>{label}</a>
                                </li>
                            })}
                        </ul>
                    </nav>
                </div>

            </ul>
        }
    }

    return <div className="w-100 p-2 ">
        <h2 className="w-100 visua">Science Gateway Discovery Interface</h2>
        <div className="w-100 p-3 d-flex flex-row">
            <input type="text" className="form-control flex-fill" placeholder="Search"
                   onChange={handleSearchChange.bind(this)}
                   onKeyDown={handleSearchKeyDown.bind(this)}/>
            <a className="btn btn-primary" onClick={triggerSearch}>Search</a>
        </div>
        {getGatewayList()}
    </div>

}

