import { useEffect, useState } from "react"
import PhoneList from "./PhoneList";
import personService from "../services/phonebook"

const PhoneBook = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');

    useEffect(() => {
        console.log('effect');
        personService.getAll()
            .then(allPersons => {
                console.log('promise fullfilled');
                console.log(allPersons);
                setPersons(allPersons);
            });
    },[])

    const addName = (event) => {
        event.preventDefault();
        const personObject = {
            name: newName,
            number: newNumber
        };

        if(persons.map(person => person.name).includes(newName)){
            if (window.confirm(`${newName} is already added to phonebook, update?`)) {
                console.log(`${newName} is already exist, choose to update...`);
                const person = persons.find(person => person.name === newName);
                const changedPerson = {...person, number: newNumber};
                console.log(changedPerson);
                const id = person.id;
                personService.update(id, changedPerson)
                    .then(returnedPerson => {
                        setPersons(persons.map(person => person.id !== id ? person: returnedPerson));
                    });
            } else {
                console.log(`${newName} is already exist, canceled...`);
            }
        }else{
            personService.create(personObject)
                .then(returnedPerson => {
                    const newPersons = persons.concat(returnedPerson);
                    setPersons(newPersons);
                    setNewName('');
                });
        }
    }

    const handleRemove = (id) => {
        personService.remove(id)
            .then(() => {
                setPersons(persons.filter(x => x.id !== id));
            });
    }

    const handleNewNameChange = (event) => {
        setNewName(event.target.value);
    }

    const handleNewNumberChange = (event) => {
        setNewNumber(event.target.value);
    }

    const handleNewFilterChange = (event) => {
        const newPersons = persons.map(person => ({
            id: person.id,
            name: person.name,
            number: person.number,
            show: person.name.toLowerCase().includes(event.target.value.toLowerCase())
        }));
        setPersons(newPersons);
    }

    return (
        <div>
            <h2>PhoneBook</h2>
            <div>
                filter shown with:<input onChange={handleNewFilterChange}></input>
            </div>
            <h2>add a new</h2>
            <form>
                <div>
                    name: <input value={newName} onChange={handleNewNameChange}></input>
                </div>
                <div>
                    number: <input value={newNumber} onChange={handleNewNumberChange}></input>
                </div>
                <div>
                    <button type="submit" onClick={addName}>add</button>
                </div>
            </form>
            <h2>Numbers</h2>
            <ul>
                {persons.map(person => 
                    <PhoneList key={person.id} name={person.name} number={person.number} show={person.show}
                        handleRemove={() => handleRemove(person.id)}></PhoneList>)}
            </ul>
        </div>
    );
}

export default PhoneBook;