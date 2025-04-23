import en from "../locales/en.json";
import uk from "../locales/uk.json";
import eo from "../locales/eo.json";
import es from "../locales/es.json";
import pt from "../locales/pt.json";
import de from "../locales/de.json";
import fr from "../locales/fr.json";
import it from "../locales/it.json";
import pl from "../locales/pl.json";
import hi from "../locales/hi.json";
import ja from "../locales/ja.json";
import ko from "../locales/ko.json";
import tr from "../locales/tr.json";
import ar from "../locales/ar.json";
import zh from "../locales/zh.json";
import ru from "../locales/ru.json";

type LanguageCode =
    | "en"
    | "uk"
    | "eo"
    | "es"
    | "pt"
    | "de"
    | "fr"
    | "it"
    | "pl"
    | "hi"
    | "ja"
    | "ko"
    | "tr"
    | "ar"
    | "zh"
    | "ru";

class I18nService {
    private currentLang: LanguageCode = "en";
    private languages: Record<LanguageCode, any> = {
        en,
        uk,
        eo,
        es,
        pt,
        de,
        fr,
        it,
        pl,
        hi,
        ja,
        ko,
        tr,
        ar,
        zh,
        ru,
    };

    setLanguage(lang: LanguageCode) {
        this.currentLang = lang;
    }

    t(path: string): string {
        const keys = path.split(".");
        let result = this.languages[this.currentLang];
        for (const key of keys) {
            result = result?.[key];
            if (!result) return path;
        }
        return result;
    }

    getCurrentLang(): LanguageCode {
        return this.currentLang;
    }

    getAvailableLanguages(): LanguageCode[] {
        return Object.keys(this.languages) as LanguageCode[];
    }

    getInfoKeysAmount(): number {
        if (this.languages[this.currentLang].info) {
            return Object.keys(this.languages[this.currentLang].info).length;
        }else {
            return 0;
        }
    }
}

export const i18n = new I18nService();
