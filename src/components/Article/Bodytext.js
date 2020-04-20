import React from "react";
import PropTypes from "prop-types";
import "katex/dist/katex.min.css";

const Bodytext = props => {
  const { html, theme } = props;

  return (
    <React.Fragment>
      <div className="bodytext" dangerouslySetInnerHTML={{ __html: html }} />

      <style jsx>{`
        .bodytext {
          animation-name: bodytextEntry;
          animation-duration: ${theme.time.duration.long};

          :global(h2),
          :global(h3) {
            margin: 1.5em 0 1em;
          }

          :global(h2) {
            line-height: ${theme.font.lineHeight.s};
            font-size: ${theme.font.size.l};
          }

          :global(h3) {
            font-size: ${theme.font.size.m};
            line-height: ${theme.font.lineHeight.m};
          }

          :global(p) {
            font-size: ${theme.font.size.s};
            line-height: ${theme.font.lineHeight.xxl};
            margin: 0 0 1.5em;
          }

          :global(ul) {
            list-style: circle;
            margin: 0 0 1.5em;
            padding: 0 0 0 1.5em;
          }

          :global(li) {
            margin: 0.7em 0;
            line-height: 1.5;
          }

          :global(a) {
            font-weight: ${theme.font.weight.bold};
            color: ${theme.color.brand.primary};
            text-decoration: underline;
          }

          :global(a.gatsby-resp-image-link) {
            border: 0;
            display: block;
            margin: 2.5em 0;
            border-radius: ${theme.size.radius.default};
            overflow: hidden;
            border: 1px solid ${theme.line.color};
          }

          :global(code.language-text) {
            background: ${theme.color.neutral.gray.c};
            text-shadow: none;
            color: inherit;
            padding: 0.1em 0.3em 0.2em;
            border-radius: 0.1em;
          }

          :global(table) {
            margin: 0.7em 0;
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;

            :global(th:first-child) {
              border-radius: ${theme.size.radius.default} 0 0 0;
            }

            :global(th:last-child) {
              border-radius: 0 ${theme.size.radius.default} 0 0;
              border-right: 1px solid ${theme.color.brand.primary};
            }

            :global(th) {
              text-align: center;
              color: ${theme.color.neutral.white};
              background: linear-gradient(${theme.color.brand.light}, ${theme.color.brand.dark});
              border-left: 1px solid ${theme.color.brand.primary};
              border-top: 1px solid ${theme.color.brand.primary};
              border-bottom: 1px solid ${theme.color.brand.primary};
              box-shadow: 0px 1px 1px rgba(255, 255, 255, 0.3) inset;
              width: 25%;
              padding: 0.7em 0;
            }

            :global(td) {
              text-align: center;
              border-left: 1px solid ${theme.line.color};
              border-bottom: 1px solid ${theme.line.color};
              border-top: none;
              box-shadow: 0px -3px 5px 1px ${theme.color.neutral.gray.c} inset;
              width: 25%;
              padding: 0.7em 0;
            }

            :global(td:last-child) {
              border-right: 1px solid ${theme.line.color};
            }

            :global(tr:last-child td:first-child) {
              border-radius: 0 0 0 ${theme.size.radius.default};
            }

            :global(tr:last-child td:last-child) {
              border-radius: 0 0 ${theme.size.radius.default} 0;
            }
          }

          :global(blockquote) {
            color: ${theme.color.neutral.gray.h};
            margin: 0.7em 0;
            padding-left: 1.5em;
            border-left: 0.5em ${theme.color.neutral.gray.c} solid;
          }
        }

        @keyframes bodytextEntry {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

Bodytext.propTypes = {
  html: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired
};

export default Bodytext;
