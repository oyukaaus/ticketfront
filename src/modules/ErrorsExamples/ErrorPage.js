import React from "react";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import "../../../_metronic/_assets/sass/pages/error/error-6.scss";

import { useTranslation } from "react-i18next";

export function ErrorPage() {
  const { t } = useTranslation();
  alert('ERRPR')
  return (
    <div className="d-flex flex-column flex-root">
      <div
        className="error error-6 d-flex flex-row-fluid bgi-size-cover bgi-position-center"
        style={{
          backgroundImage: `url(${toAbsoluteUrl("/media/error/bg6.jpg")})`,
        }}
      >
        <div className="d-flex flex-column flex-row-fluid text-center">
          <h1
            className="error-title font-weight-boldest text-white mb-12"
            style={{ marginTop: "12rem;" }}
          >
            404
          </h1>
          <p className="display-4 font-weight-bold text-white">
            {t("notFound")}
          </p>
          <a href="/" className="display-4 font-weight-bold text-white">
            {t("notFound")}
          </a>
        </div>
      </div>
    </div>
  );
}
