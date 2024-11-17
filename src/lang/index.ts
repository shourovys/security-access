import en from './en.json'
import ko from './ko.json'
import generic from './generic.json'
import fr from './fr.json'
import es from './es.json'
import de from './de.json'
import zh from './zh.json'

const _lang: { [key: string]: { [key: string]: string } } = {
  generic,
  en,
  fr,
  de,
  es,
  ko,
  zh,
}

export default _lang
