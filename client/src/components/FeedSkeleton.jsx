import React from "react";


const FeedSkeleton = () => {
  return (
    <div className="feedSkeleton">
      {[...Array(3)].map((_, index) => (
        <div className="feedSkeleton__item" key={index}>
          <div className="feedSkeleton__item-head">
            <div></div>
          </div>
          <div className="feedSkeleton__item-body"></div>
          <div className="feedSkeleton__item-footer">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedSkeleton;
