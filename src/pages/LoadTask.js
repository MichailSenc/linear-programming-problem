import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Context from "../context/modal/context";
import SolutionContext from "../context/solution/solutionContext";

const LoadTask = () => {
    const { solutionData } = useContext(SolutionContext);
    const [data, setData] = useState([]);

    useEffect(() => {
        getJsonData();
        console.log(solutionData);
    }, []);

    const getJsonData = async () => {
        const sendRequest = (url) => {
            const requestOptions = {
                method: "GET",
                headers: { "Content-Type": "application/json" },
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

        await sendRequest("http://localhost:8888/")
            .then((data) => {
                console.log(data);
                console.log(typeof data);
                setData(data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const GetData = () => {
        console.log(data);
        if (data.length === 0) {
            return (
                <>
                    <h3>Список сохранённых конфигураций пуст!</h3>
                </>
            );
        }

        const GetRows = () => {
            return data.map((obj, i) => {
                return (
                    <>
                        <tr key={i}>
                            <th className="text-center" scope="row">
                                {i + 1}
                            </th>
                            <td className="text-center">{obj.name}</td>
                            <td className="text-center">{obj.date}</td>
                            <td className="text-center">
                                <Button className="load_button" variant="primary" pointer={i}>
                                    Загрузить
                                </Button>
                            </td>
                            <td className="text-center">
                                <Button className="load_button" variant="danger" pointer={i}>
                                    Удалить
                                </Button>
                            </td>
                        </tr>
                    </>
                );
            });
        };

        return (
            <>
                <table className="table table-striped ref_table ">
                    <thead>
                        <tr>
                            <th scope="col" style={{ width: "5%" }}>
                                #
                            </th>
                            <th scope="col">Название</th>
                            <th scope="col">Дата загрузки</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <GetRows />
                    </tbody>
                </table>
            </>
        );
    };

    return (
        <>
            <GetData />
        </>
    );
};

export default LoadTask;
