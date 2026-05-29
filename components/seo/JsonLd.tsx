import React from "react";

export const JsonLd = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ROAM Robotics Club",
    "alternateName": [
      "schulichroam",
      "Schulich ROAM",
      "Robotics Operation for Autonomous Mapping"
    ],
    "url": "https://schulichroam.com",
    "logo": "https://schulichroam.com/logo.png",
    "sameAs": [
      "https://www.instagram.com/schulichroam/",
      "https://www.linkedin.com/company/schulichroam/",
      "https://github.com/Robotics-Operation-Autonomous-Mapping",
      "https://linktr.ee/schulichroam"
    ],
    "description": "ROAM (Robotics Operation for Autonomous Mapping) is a premier student-led robotics club building intelligent autonomous systems at the Schulich School of Engineering, University of Calgary.",
    "email": "schulichroam@gmail.com",
    "parentOrganization": {
      "@type": "EducationalOrganization",
      "name": "Schulich School of Engineering, University of Calgary",
      "url": "https://schulich.ucalgary.ca"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ROAM Robotics Club",
    "url": "https://schulichroam.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://schulichroam.com/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
};
