import React, {useState} from 'react';
import {CheckBox, Collapse} from "antd";

const {Panel} = Collapse

const mock_data = [
    {
        "item_id": 1,
        "category": "food"
    },
    {
        "item_id": 2,
        "category": "hobby"
    },
    {
        "item_id": 3,
        "category": "travel"
    },
    {
        "item_id": 4,
        "category": "books"
    }
]

function CheckBox(props) {

    const [Checked, setChecked] = useState(initialState)

    const handleToggle = (value) => {

        const currentIndex = Checked.indexOf(value);
        const newChecked = [...Checked]

        if(currentIndex === -1) {
            newChecked.push(value)
        } else {
            newChecked.splice(currentIndex, 1)
        }

        setChecked(newChecked)
        props.handleFilters(newChecked)
    }

    const renderCheckboxLists = () => mock_data.map((value, index) => (
        <React.Fragment key={{index}}>
            <Checkbox
                onChange={() => handleToggle(value.item_id)}
                type="checkbox"
                checked={Checked.indexOf(value.item_id) !== -1}
            />
            <span>{value.category}</span>
        </React.Fragment>
    ))

    return (
        <div>
            <Collapse defaultActiveKey={['0']}>
                <Panel header key="1">
                    {renderCheckboxLists()}
                </Panel>
            </Collapse>
        </div>
    )
}

export default CheckBox