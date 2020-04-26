

const util = {
	map(value, domainMin, domainMax, rangeMin, rangeMax) {
		return (value - domainMin) * (rangeMax - rangeMin) / (domainMax - domainMin) + rangeMin
	}
}

export default util