import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function NotFound() {
  const { t } = useTranslation();

  return (
    <>
      <h2 data-testid='not-found-caption'>{t('not-found')}</h2>
      <p>
        <Trans i18nKey="back-to-homepage">
          <Link to='/'>homepage</Link>
        </Trans>
      </p>
    </>
  );
}

export default NotFound;
