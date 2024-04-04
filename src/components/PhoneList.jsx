const PhoneList = ({name,number,show,handleRemove}) => {
    if(show){
        return (
            <li>
                {name}: {number}
                <button onClick={handleRemove}>delete</button>
            </li>
        )
    }
}

export default PhoneList;