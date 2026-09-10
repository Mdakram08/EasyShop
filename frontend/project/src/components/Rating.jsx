import { useState, useEffect } from "react";
import "../componentsStyling/Rating.css";

function Rating({ value = 0, onRatingChange, disabled = false }) {
    const [selectedRating, setSelectedRating] = useState(value);
    const [hoverRating, setHoverRating] = useState(0);

    useEffect(() => {
        setSelectedRating(value);
    }, [value]);

    const handleClick = (rating) => {
        if (disabled) return;

        setSelectedRating(rating);

        if (onRatingChange) {
            onRatingChange(rating);
        }
    };

    return (
        <div
            className="rating"
            onMouseLeave={() => setHoverRating(0)}
        >
            {[1, 2, 3, 4, 5].map((star) => {

                const activeRating = hoverRating || selectedRating;

                return (
                    <span
                        key={star}
                        className={`star ${
                            star <= activeRating ? "filled" : "empty"
                        }`}
                        onMouseEnter={() => {
                            if (!disabled) {
                                setHoverRating(star);
                            }
                        }}
                        onClick={() => handleClick(star)}
                    >
                        ★
                    </span>
                );
            })}
        </div>
    );
}

export default Rating;// import { useState, useEffect } from "react";
// import "../componentsStyling/Rating.css";

// function Rating({ value, onRatingChange, disabled = false }) {
//     const [hoverRating, setHoverRating] = useState(0);
//     const [selectRating, setSelectRating] = useState(value || 0);

//     // Keep selected rating synchronized with parent value
//     useEffect(() => {
//         setSelectRating(value || 0);
//     }, [value]);

//     const handleMouseEnter = (rating) => {
//         if (!disabled) {
//             setHoverRating(rating);
//         }
//     };

//     const handleMouseLeave = () => {
//         if (!disabled) {
//             setHoverRating(0);
//         }
//     };

//     const handleClick = (rating) => {
//         if (disabled) {
//             return;
//         }

//         setSelectRating(rating);

//         if (onRatingChange) {
//             onRatingChange(rating);
//         }
//     };

//     const generateStar = () => {
//         const stars = [];

//         for (let i = 1; i <= 5; i++) {
//             const isFilled =
//                 i <= (hoverRating || selectRating);

//             stars.push(
//                 <span
//                     key={i}
//                     className={`star ${isFilled ? "filled" : "empty"}`}
//                     onMouseEnter={() => handleMouseEnter(i)}
//                     onMouseLeave={handleMouseLeave}
//                     onClick={() => handleClick(i)}
//                     style={{
//                         pointerEvents: disabled ? "none" : "auto"
//                     }}
//                 >
//                     ★
//                 </span>
//             );
//         }

//         return stars;
//     };

//     return (
//         <div className="rating">
//             {generateStar()}
//         </div>
//     );
// }

// export default Rating;