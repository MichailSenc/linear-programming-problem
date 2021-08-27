import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import {useHistory} from "react-router";
import Context from "../context/newTask/context";
import {ADDHOST, DELHOST, NEW_REF} from "../refs";
import ClipLoader from "react-spinners/ClipLoader";

const LoadTask = () => {
    const {setAll, inputValues} = useContext(Context);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    useEffect(() => {
        getJsonData();
        setLoading(true);
    }, []);

    const sendRequest = (url) => {
        const requestOptions = {
            headers: {"Content-Type": "application/json"},
        };

        return fetch(url, requestOptions).then((response) => {
            if (response.ok) {
                return response.json();
            }

            return response.json().then((error) => {
                const e = new Error("Что-то пошло не так");
                e.data = error;
                throw e;
            });
        });
    };

    const getJsonData = async () => {
        await sendRequest(ADDHOST)
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((err) => {});
    };

    const onLoad = (id) => {
        setAll(data[id].newTaskstate);
        inputValues.current = data[id].inputValues;
        history.push(NEW_REF);
    };

    const postFetch = (url, body = null) => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body),
        };

        return fetch(url, requestOptions).then((response) => {
            if (response.ok) {
                return response.json();
            }

            return response.json().then((error) => {
                const e = new Error("Что-то пошло не так");
                e.data = error;
                throw e;
            });
        });
    };

    const onDelete = async (id) => {
        const d = data.filter((item, i) => i !== id);
        setData(d);
        await postFetch(DELHOST, d).catch((err) => {});
    };

    const GetData = () => {
        if (data.length === 0) {
            return <p className="title">Список сохранённых конфигураций пуст!</p>;
        }

        const GetRows = () => {
            return data.map((obj, i) => {
                return (
                    <div className="table-16__body-row" key={i}>
                        <div className="table-16__body-item">{i + 1}</div>
                        <div className="table-16__body-item">{obj.name || "<пусто>"}</div>
                        <div className="table-16__body-item">{obj.date || "<пусто>"}</div>

                        <button className="button button_primary" type="button" pointer={i} onClick={() => onLoad(i)}>
                            Загрузить
                        </button>
                        <button className="button button_danger" type="button" pointer={i} onClick={() => onDelete(i)}>
                            Удалить
                        </button>
                    </div>
                );
            });
        };

        return (
            <div className="table-content__table table-16 table-16_striped table-16_load">
                <div className="table-16__head">
                    <div className="table-16__head-item">#</div>
                    <div className="table-16__head-item">Название</div>
                    <div className="table-16__head-item">Дата загрузки</div>
                    <div className="table-16__head-item"></div>
                </div>
                <div className="table-16__body">
                    <GetRows />
                </div>
            </div>
        );
    };

    return (
        <div className="container pt-3">
            {loading ? (
                <div className="d-flex justify-content-center">
                    <ClipLoader color={"#1C1D1C"} loading={loading} size={50} />
                </div>
            ) : (
                <GetData />
            )}
        </div>
    );
};

export default LoadTask;
