import React from "react";

export default function Collection() {
  return (
    <>
      <div className="collection">
        <div className="collection__leftPanel">
          <h2 className="collection__sortTitle">Sorted by :</h2>
          <ul className="collection__sortBy">
            <li className="collection__sorted collection__sortedFirst">
              All cards
            </li>
            <li className="collection__sorted">Red</li>
            <li className="collection__sorted">White</li>
            <li className="collection__sorted">Green</li>
            <li className="collection__sorted">Black</li>
            <li className="collection__sorted collection__sortedLast">Blue</li>
          </ul>
        </div>
        <div className="collection__rightPanel"></div>
      </div>
    </>
  );
}
