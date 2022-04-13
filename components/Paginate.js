


const Paginate = ({pageSelected, currentPage, itemsPerPage, totalItems}) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil( totalItems /  itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div>
            <ul className="pagination pagination-sm justify-content-end border-0">
                {pageNumbers.map(number => {
                let classes = "page-item ";
                if (number === currentPage) {
                    classes += "active";
                }

                return (
                    <li className={classes}>
                    <a
                        onClick={() => pageSelected(number)}
                        href="#"
                        className="page-link"
                    >
                        {number}
                    </a>
                    </li>
                );
                })}
            </ul>
        </div>
    )


}

export default Paginate