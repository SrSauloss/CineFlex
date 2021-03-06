import styled from "styled-components";
import { useParams, useHistory, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BackPage, ConfirmButton, Container, Description } from "../Shared/style";
import { URL_SERVER } from "../Shared/Api";
import axios from 'axios';
import Seat from './Seat';
import SeatInfos from './SeatInfos';
import BottomBar from './BottomBar';
import InfoClient from './InfoClient';
import Loading from '../Shared/Loading';
import Back from "../Shared/Back";


export default function Seats({seatSelecteds, setSeatSelecteds, setPurchaseInfo}) {
    
    const [seats, setSeats] = useState(null);
    const [numbers, setNumbers] = useState([]);
    const [name, setName] = useState("");
    const [cpf, setCpf] = useState("");
	const { idSession } = useParams();
    const history = useHistory();
    let validData = isValide(name, cpf);

    useEffect (() => {
        const request = axios.get(`${URL_SERVER}showtimes/${idSession}/seats`)
        request.then(resp => {
            setSeats(resp.data);
        });
    }, []);
    
    function sendData() {
        setPurchaseInfo({name, cpf, numbers, title: seats.movie.title, date: seats.day.date, hour:seats.name});
        const request = axios.post(`${URL_SERVER}seats/book-many`, {ids: seatSelecteds, name: name, cpf: cpf});
        request.then(resp => {
            alert("Compra efetuada com sucesso!");
        })
    }

    return (
        <Container>
            <Back history={history}/>
            {seats ? 
                <>
                    <Description>
                        <p>Selecione o(s) assento(s)</p>
                    </Description>

                    <SeatsSession>
                        {seats.seats.map(({name, id, isAvailable}) =>(
                            <Seat 
                                key={id}
                                name={name}
                                id={id}
                                isAvailable={isAvailable}
                                seatSelecteds={seatSelecteds}
                                setSeatSelecteds={setSeatSelecteds}
                                numbers={numbers}
                                setNumbers={setNumbers}
                                onClick={() => history.push(`/Seats/${idSession}`)}
                            /> 
                        ))}
                    </SeatsSession>                
                    
                    <SeatInfos/>

                    <InfoClient 
                        name={name}
                        cpf={cpf}
                        setName={setName}
                        setCpf={setCpf}
                    />

                    <ConfirmButton pointer={validData ? "visible" : "none"} onClick={sendData}>
                        <Link to="/Sucess">
                                <button>Reservar assento(s)</button>
                        </Link>
                    </ConfirmButton>
                
                    <BottomBar 
                        seats={seats} 
                        title={seats.movie.title} 
                        name={seats.name} 
                        image={seats.movie.posterURL}
                        weekday={seats.day.weekday} 
                    />
                </>
                :
                <Loading/>
            }
        </Container>
    );
}   

function isValide(name, cpf) {
    return name.length > 0 && cpf.length === 11;
}

const SeatsSession = styled.ul`
    display: flex;
    flex-wrap: wrap;
    padding-left: 24px;
`;