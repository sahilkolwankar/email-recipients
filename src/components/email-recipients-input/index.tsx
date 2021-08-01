import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from 'lodash';
import cn from 'classnames';

import style from './style.module.scss';

interface PassedProps {
    suggestions: string[];
}

const EmailRecipientsInput: FC<PassedProps> = ({ suggestions }) => {
    const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [postedSuggestions, setPostedSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const [userInput, setUserInput] = useState<string>('');

    useEffect(() => {
        if (!userInput.length) {
            setActiveSuggestion(-1);
            setFilteredSuggestions([]);
            setShowSuggestions(false);
        }
    }, [userInput]);

    const postedSuggestionsLength = useMemo(() => postedSuggestions.length, [postedSuggestions.length]);

    const alreadyIncludedBadge = useMemo(() => (
        <div className={style['badge--included']}>
            included
        </div>
    ), []);

    const noMatchingEmailsBar = useMemo(() => (
        <ul className={cn(style['suggestions'], style['suggestions--empty'])}>
            <li className={style['suggestions_empty-text']}>
                <span>No matching email found. Please update your contacts.</span>
            </li>
        </ul>
    ), []);

    const contactsCountBar = useMemo(() => (
        <div className={style['posted-count']}>
            <span className={style['posted-count__text']}>
                {postedSuggestionsLength} contacts added so far...
            </span>
        </div>
    ), [postedSuggestionsLength]);

    /**
     * Adding a delay of 300ms, assuming an average typing speed of 200 chars per minute,
     *  or an average 40 words per minute (assuming 5 chars per word)
     */
    const searchEmails = debounce(useCallback((tempUserInput: string) => {
        if (tempUserInput.length) {
            const tempFilteredSuggestions = suggestions.filter((suggestion) =>
                suggestion.toLowerCase().indexOf(tempUserInput.toLowerCase()) > -1
            );
            setFilteredSuggestions(tempFilteredSuggestions.slice(0, 8));
            setActiveSuggestion(0);
            setShowSuggestions(true);
        }
    }, [suggestions]), 300);

    /**
     * Set the text in the input box and fetch filtered suggestions
     */
    const onChange = useCallback((e) => {
        const tempUserInput = e.currentTarget.value;
        setUserInput(tempUserInput);
        searchEmails(tempUserInput);
    }, [searchEmails]);

    /**
     * 
     */
    const handleSuggestionClick = useCallback((e) => {
        if (postedSuggestions.includes(filteredSuggestions[activeSuggestion])) {
            return;
        }
        setActiveSuggestion(0);
        setFilteredSuggestions([]);
        setShowSuggestions(false);
        setUserInput('');
        setPostedSuggestions([
            ...postedSuggestions,
            e.currentTarget.innerText,
        ]);
    }, [activeSuggestion, filteredSuggestions, postedSuggestions]);

    const handleMouseOver = useCallback((index: number) => {
        setActiveSuggestion(index);
    }, []);

    const handleMouseLeave = useCallback((index: number) => {
        setActiveSuggestion(-1);
    }, []);

    const onKeyDown = useCallback((e) => {
        // 'ENTER' key
        if (e.keyCode === 13) {
            if (!userInput.length) {
                return;
            }
            if (postedSuggestions.includes(filteredSuggestions[activeSuggestion])) {
                return;
            }
            if (!filteredSuggestions.length) {
                return;
            }
            setUserInput('');
            setPostedSuggestions([
                ...postedSuggestions,
                filteredSuggestions[activeSuggestion],
            ]);
            setActiveSuggestion(0);
            setShowSuggestions(false);
        }
        // 'TAB' key
        else if (e.keyCode === 9) {
            // Avoid default behavior of selecting the browser address bar
            e.preventDefault();
            if (postedSuggestions.includes(filteredSuggestions[activeSuggestion])) {
                return;
            }
            if (!filteredSuggestions.length) {
                return;
            }
            setUserInput(filteredSuggestions[activeSuggestion]);
            setFilteredSuggestions([filteredSuggestions[activeSuggestion]]);
            setActiveSuggestion(0);
            setShowSuggestions(true);
        }
        // 'UP' arrow
        else if (e.keyCode === 38) {
            if (activeSuggestion === 0) {
                return;
            }

            setActiveSuggestion(activeSuggestion - 1);
        }
        // 'DOWN' arrow
        else if (e.keyCode === 40) {
            if (activeSuggestion + 2 > filteredSuggestions.length) {
                return;
            }
        
            setActiveSuggestion(activeSuggestion + 1);
        }
    }, [activeSuggestion, filteredSuggestions, postedSuggestions]);

    const removePostedSuggestion = useCallback((event, postedSuggestion) => {
        event.stopPropagation();
        const filteredPostedSuggestions = postedSuggestions
            .filter((currentPostedSuggestion: string) => postedSuggestion !== currentPostedSuggestion);
        setPostedSuggestions(filteredPostedSuggestions);
    }, [postedSuggestions]);

    const renderSuggestionListItem = useCallback((suggestion: string, index: number) => {
        const isEmailAlreadyAdded = postedSuggestions.includes(suggestion);
        return (
            <li
                className={cn(
                    index === activeSuggestion ? style['suggestion--active'] : "",
                    isEmailAlreadyAdded ? style['suggestion--disabled'] : "",
                )}
                key={suggestion}
                onClick={handleSuggestionClick}
                onMouseOver={() => handleMouseOver(index)}
                onMouseLeave={() => handleMouseLeave(index)}
            >
                {suggestion}
                {isEmailAlreadyAdded && (
                    <div className={style['included__wrapper']}>
                        {alreadyIncludedBadge}
                        <div className={style['posted-suggestion--remove']} onClick={(event) => removePostedSuggestion(event, suggestion)}>
                            <span>x</span>
                        </div>
                    </div>
                )}
            </li>
        );
    }, [
        activeSuggestion,
        alreadyIncludedBadge,
        handleMouseLeave,
        handleMouseOver,
        handleSuggestionClick,
        postedSuggestions,
        removePostedSuggestion,
    ]);

    const suggestionsListComponent = useMemo(() => {
        if (showSuggestions && userInput) {
            if (filteredSuggestions.length) {
                return (
                    <ul
                        className={cn(
                            style['suggestions'],
                            postedSuggestionsLength > 8 && style['suggestions--pulled-up'],
                        )}
                    >
                        {filteredSuggestions.map((suggestion, index) => renderSuggestionListItem(suggestion, index))}
                    </ul>
                );
              } else {
                return noMatchingEmailsBar;
              }
        }
        return null;
    }, [filteredSuggestions, noMatchingEmailsBar, postedSuggestionsLength, renderSuggestionListItem, showSuggestions, userInput]);

    const renderPostedSuggestions = useCallback((postedSuggestion: string) => {
        return (
            <div className={style['posted-suggestion']} key={postedSuggestion}>
                <div className={style['posted-suggestion__text']}>
                    {postedSuggestion}
                </div>
                <div className={style['posted-suggestion--remove']} onClick={(event) => removePostedSuggestion(event, postedSuggestion)}>
                    <span>x</span>
                </div>
            </div>
        );
    }, [removePostedSuggestion]);

    return (
        <div className={style['wrapper']}>
            <div
                className={cn(
                    style['text-box--dummy'],
                    ((postedSuggestionsLength > 8) || showSuggestions) && style['top-border-radius-only'],
                )}
            >
                {postedSuggestions.map(renderPostedSuggestions)}
                <input
                    type="text"
                    className={style['input-box']}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    placeholder={postedSuggestionsLength ? '' : 'Enter recipients...'}
                    value={userInput}
                />
            </div>
            {postedSuggestionsLength > 8 && contactsCountBar}
            {suggestionsListComponent}
        </div>
      );
};

export default EmailRecipientsInput as FC<PassedProps>;
