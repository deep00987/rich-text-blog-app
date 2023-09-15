import React from 'react'
import "./Dropdown.css"

const Dropdown = ({ trigger, menu, data_header }) => {
    const [open, setOpen] = React.useState(false);
    const dropdownRef = React.useRef(null);

    const handleOpen = () => {
        setOpen(!open);
    };

    const handleOutsideClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setOpen(false);
        }
    };

    React.useEffect(() => {
        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);


    return (
        <div className="dropdown"  ref={dropdownRef}>
            {React.cloneElement(trigger, {
                onClick: handleOpen,
            })}
            {open ? (
                <ul className="drop_down_menu">
                    <li className='menu-item-header'><div className="drop_down_menu_header">{data_header}</div></li>
                    {menu.map((menuItem, index) => (
                        <li key={index} className="menu-item">
                            {React.cloneElement(menuItem, {
                                onClick: () => {
                                    menuItem.props.onClick();
                                    setOpen(false);
                                },
                            })}
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    );
};

export default Dropdown