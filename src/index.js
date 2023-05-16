
import {fetchCountries} from './fetchCountries'
import debounce from 'lodash.debounce';
import './css/styles.css';
import Notiflix from 'notiflix';


const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');


input.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry(eve) {
    eve.preventDefault();


    const inputValue = eve.target.value.trim();
    if (!inputValue) {
        resetMarkup(countryList);
        resetMarkup(countryInfo);
        return;
    }

    fetchCountries(inputValue)
        .then(dataCantry => {
            if (dataCantry.length > 10) {
                Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
            } else if (dataCantry.length >= 2 && dataCantry.length <= 10) {
                resetMarkup(countryList);
                createMarkupCountryList(dataCantry);
                resetMarkup(countryInfo);
            } else {
                resetMarkup(countryInfo);
                createMarkupCountryInfo(dataCantry);
                resetMarkup(countryList);
            }
        })
        .catch(() => {
            resetMarkup(countryInfo);
            resetMarkup(countryList);
            Notiflix.Notify.failure('Oops, there is no country with that name');
        });
     
}


function createMarkupCountryList(dataCantry) {   
const markup = dataCantry
    .map(({ name, flags }) => {
        return `<li class="country-list__item">
        <img class="country-list__img" src="${flags.svg}" alt="flag" />
        <p class="country-list__text">${name.official}</p>
      </li>`;
    }).join('');
return countryList.insertAdjacentHTML("beforeend", markup);
} 

function createMarkupCountryInfo(dataCantry) {
    const markup = dataCantry
        .map(({ name, capital, population, flags, languages }) => {
        return `<div class="country__flag">
    <img class="country__img" src="${flags.svg}" alt="flag">
    <p class="country__name">${name.official}</p>
  </div>
  <ul class="country__info">
      <li class="country__item"> <b>Capital</b>:
    <span class="country__span">${capital}</span>
      </li>
      <li class="country__item"> <b>Population</b>:
    <span class="country__span">${population}</span>
      </li>
      <li class="country__item"> <b>Languages</b>:
    <span class="country__span">${Object.values(languages).join(', ')}</span>
      </li>
  </ul>`;
        }).join('')
    return countryInfo.insertAdjacentHTML('beforeend', markup);
}

function resetMarkup(el) {
    el.innerHTML = '';
}