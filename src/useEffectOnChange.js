
import {useEffect, useRef} from "react";
/**
 * @typedef {function} Comparator
 * @param lastValue
 * @param nextValue
 * @return {boolean} areEqual
 */

/**
 * callBack only works when dependencies change
 * (doesn't work on first render)
 *
 * @param {function} callBack
 * @param {Array} dependencies
 * @param {Comparator} comparator - function to compare dependencies in array
 */
export const useEffectOnChange = (
    callBack, dependencies,
    comparator = (lastValue, nextValue)=>{
        return lastValue === nextValue
    }) => {
    const lastValue = useRef(dependencies);

    useEffect(()=>{
        const isNotFirstAndNew = lastValue.current &&
            dependencies &&
            lastValue.current.some(
                (lastValue, i) => !comparator(lastValue, dependencies[i])
            );

        lastValue.current = dependencies;
        if(isNotFirstAndNew){
            return  callBack()
        }
    }, dependencies);
};