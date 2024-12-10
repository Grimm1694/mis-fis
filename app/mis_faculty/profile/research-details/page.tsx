"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { NavLinks } from "@/components/faculty/ui/nav-links";
import { useRouter } from "next/navigation";
export default function ResearchProfile() {
  const [researchDetails, setResearchDetails] = useState<{
    facultyId: string;
    orcidId: string | null;
    googleScholarId: string | null;
    scopusId: string | null;
    publonsId: string | null;
    researchId: string | null;
    patent: Array<{
      areaOfResearch: string;
      patentPeriod: string;
      grantedYear: number;
      author1: string;
      author2?: string;
      author3?: string;
      author4?: string;
    }>;
    publications: Array<{
      publicationType: string;
      name: string;
      volume?: string;
      pageNumber?: string;
      doi?: string;
      impactFactor?: number;
    }>;
    conferenceandjournal: Array<{
      role: string;
      title: string;
      journalName: string;
      issueNo?: string;
      volume?: string;
      yearOfPublication: number;
      pageNo?: string;
      author1: string;
      author2?: string;
      author3?: string;
      author4?: string;
      publishedUnder?: string;
      impactFactor?: number;
      quartile?: string;
      sponsor?: string;
      venue: string;
      fromDate: string;
      toDate: string;
    }>;
    researchGrant: Array<{
      name: string;
      sanctionedDate: string;
      projectPeriod: string;
      amountSanctioned: number;
      fundedBy: string;
      principalInvestigator: string;
      coPrincipalInvestigator?: string;
      phdAwarded: boolean;
      status: string;
    }>;
    consultancy: Array<{
      sanctionedDate: string;
      projectPeriod: string;
      amount: number;
      principalInvestigator: string;
      coPrincipalInvestigator?: string;
      status: string;
    }>;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    async function fetchResearchDetails() {
      try {
        const token = localStorage.getItem("token");
        const facultyId = token ? JSON.parse(token).facultyId : null;

        if (!facultyId) {
          notFound();
          return;
        }

        const response = await fetch(
          `/api/facultyresearchdetails?facultyId=${facultyId}`
        );

        if (!response.ok) {
          notFound();
          return;
        }

        const { success, data } = await response.json();

        if (!success) {
          notFound();
          return;
        }

        setResearchDetails({
          ...data,
          patent: data.patent || [],
          publications: data.publications || [],
          conferenceandjournal: data.conferenceandjournal || [],
          researchGrant: data.researchGrant || [],
          consultancy: data.consultancy || [],
        });
      } catch (error) {
        console.error("Error fetching research details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchResearchDetails();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!researchDetails) {
    return <div>Research details not found</div>;
  }
  //// add the below code
  const handleUpdateRedirect = () => {
    // Redirect to update research page with facultyId
    router.push(
      `/faculty/updateresearch?facultyId=${researchDetails.facultyId}`
    );
  };
  return (
    <div>
      <NavLinks />
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Research Details
        </h1>
        {/* Add Update Research Button */}
        <div className="mb-6">
          <button
            onClick={handleUpdateRedirect}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update Research Details
          </button>
        </div>

        {/* Research Identifiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">ORCID ID</p>
            <p className="font-medium text-gray-800">
              {researchDetails.orcidId || "N/A"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Google Scholar ID</p>
            <p className="font-medium text-gray-800">
              {researchDetails.googleScholarId || "N/A"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Scopus ID</p>
            <p className="font-medium text-gray-800">
              {researchDetails.scopusId || "N/A"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Publons ID</p>
            <p className="font-medium text-gray-800">
              {researchDetails.publonsId || "N/A"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Research ID</p>
            <p className="font-medium text-gray-800">
              {researchDetails.researchId || "N/A"}
            </p>
          </div>
        </div>

        {/* Patents */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Patents</h2>
          {researchDetails.patent.length > 0 ? (
            researchDetails.patent.map((patent, index) => (
              <div key={index} className="mb-4">
                <p className="text-sm text-gray-500">Area of Research</p>
                <p className="font-medium text-gray-800">
                  {patent.areaOfResearch}
                </p>
                <p className="text-sm text-gray-500">Patent Period</p>
                <p className="font-medium text-gray-800">
                  {patent.patentPeriod}
                </p>
                <p className="text-sm text-gray-500">Granted Year</p>
                <p className="font-medium text-gray-800">
                  {patent.grantedYear}
                </p>
                <p className="text-sm text-gray-500">Authors</p>
                <p className="font-medium text-gray-800">
                  {[
                    patent.author1,
                    patent.author2,
                    patent.author3,
                    patent.author4,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            ))
          ) : (
            <p>No patents available</p>
          )}
        </div>

        {/* Publications */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Publications
          </h2>
          {researchDetails.publications.length > 0 ? (
            researchDetails.publications.map((publication, index) => (
              <div key={index} className="mb-4">
                <p className="text-sm text-gray-500">Publication Type</p>
                <p className="font-medium text-gray-800">
                  {publication.publicationType}
                </p>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-800">{publication.name}</p>
                <p className="text-sm text-gray-500">Volume</p>
                <p className="font-medium text-gray-800">
                  {publication.volume || "N/A"}
                </p>
                <p className="text-sm text-gray-500">Page Number</p>
                <p className="font-medium text-gray-800">
                  {publication.pageNumber || "N/A"}
                </p>
                <p className="text-sm text-gray-500">DOI</p>
                <p className="font-medium text-gray-800">
                  {publication.doi || "N/A"}
                </p>
                <p className="text-sm text-gray-500">Impact Factor</p>
                <p className="font-medium text-gray-800">
                  {publication.impactFactor || "N/A"}
                </p>
              </div>
            ))
          ) : (
            <p>No publications available</p>
          )}
        </div>

        {/* Conferences and Journals */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Conferences and Journals
          </h2>
          {Array.isArray(researchDetails.conferenceandjournal) &&
          researchDetails.conferenceandjournal.length > 0 ? (
            researchDetails.conferenceandjournal.map((conference, index) => (
              <div key={index} className="mb-4">
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium text-gray-800">{conference.role}</p>
                <p className="text-sm text-gray-500">Title</p>
                <p className="font-medium text-gray-800">{conference.title}</p>
                <p className="text-sm text-gray-500">Journal Name</p>
                <p className="font-medium text-gray-800">
                  {conference.journalName}
                </p>
                <p className="text-sm text-gray-500">Issue No</p>
                <p className="font-medium text-gray-800">
                  {conference.issueNo || "N/A"}
                </p>
                <p className="text-sm text-gray-500">Volume</p>
                <p className="font-medium text-gray-800">
                  {conference.volume || "N/A"}
                </p>
                <p className="text-sm text-gray-500">Year of Publication</p>
                <p className="font-medium text-gray-800">
                  {conference.yearOfPublication}
                </p>
                <p className="text-sm text-gray-500">Page No</p>
                <p className="font-medium text-gray-800">
                  {conference.pageNo || "N/A"}
                </p>
                <p className="text-sm text-gray-500">Authors</p>
                <p className="font-medium text-gray-800">
                  {[
                    conference.author1,
                    conference.author2,
                    conference.author3,
                    conference.author4,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <p className="text-sm text-gray-500">Published Under</p>
                <p className="font-medium text-gray-800">
                  {conference.publishedUnder || "N/A"}
                </p>
                <p className="text-sm text-gray-500">Impact Factor</p>
                <p className="font-medium text-gray-800">
                  {conference.impactFactor || "N/A"}
                </p>
                <p className="text-sm text-gray-500">Quartile</p>
                <p className="font-medium text-gray-800">
                  {conference.quartile || "N/A"}
                </p>
                <p className="text-sm text-gray-500">Sponsor</p>
                <p className="font-medium text-gray-800">
                  {conference.sponsor || "N/A"}
                </p>
                <p className="text-sm text-gray-500">Venue</p>
                <p className="font-medium text-gray-800">{conference.venue}</p>
                <p className="text-sm text-gray-500">From Date</p>
                <p className="font-medium text-gray-800">
                  {conference.fromDate}
                </p>
                <p className="text-sm text-gray-500">To Date</p>
                <p className="font-medium text-gray-800">{conference.toDate}</p>
              </div>
            ))
          ) : (
            <p>No conferences or journals available</p>
          )}
        </div>
        {/* Research Grants */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Research Grants
          </h2>
          {Array.isArray(researchDetails.researchGrant) &&
          researchDetails.researchGrant.length > 0 ? (
            researchDetails.researchGrant.map((grant, index) => (
              <div key={index} className="mb-4">
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-800">{grant.name}</p>
                <p className="text-sm text-gray-500">Sanctioned Date</p>
                <p className="font-medium text-gray-800">
                  {grant.sanctionedDate}
                </p>
                <p className="text-sm text-gray-500">Project Period</p>
                <p className="font-medium text-gray-800">
                  {grant.projectPeriod}
                </p>
                <p className="text-sm text-gray-500">Amount Sanctioned</p>
                <p className="font-medium text-gray-800">
                  {grant.amountSanctioned}
                </p>
                <p className="text-sm text-gray-500">Funded By</p>
                <p className="font-medium text-gray-800">{grant.fundedBy}</p>
                <p className="text-sm text-gray-500">Principal Investigator</p>
                <p className="font-medium text-gray-800">
                  {grant.principalInvestigator}
                </p>
                <p className="text-sm text-gray-500">
                  Co-Principal Investigator
                </p>
                <p className="font-medium text-gray-800">
                  {grant.coPrincipalInvestigator || "N/A"}
                </p>
                <p className="text-sm text-gray-500">PhD Awarded</p>
                <p className="font-medium text-gray-800">
                  {grant.phdAwarded ? "Yes" : "No"}
                </p>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium text-gray-800">{grant.status}</p>
              </div>
            ))
          ) : (
            <p>No research grants available</p>
          )}
        </div>

        {/* Consultancy */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Consultancy
          </h2>
          {Array.isArray(researchDetails.consultancy) &&
          researchDetails.consultancy.length > 0 ? (
            researchDetails.consultancy.map((consultancy, index) => (
              <div key={index} className="mb-4">
                <p className="text-sm text-gray-500">Sanctioned Date</p>
                <p className="font-medium text-gray-800">
                  {consultancy.sanctionedDate}
                </p>
                <p className="text-sm text-gray-500">Project Period</p>
                <p className="font-medium text-gray-800">
                  {consultancy.projectPeriod}
                </p>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium text-gray-800">
                  {consultancy.amount}
                </p>
                <p className="text-sm text-gray-500">Principal Investigator</p>
                <p className="font-medium text-gray-800">
                  {consultancy.principalInvestigator}
                </p>
                <p className="text-sm text-gray-500">
                  Co-Principal Investigator
                </p>
                <p className="font-medium text-gray-800">
                  {consultancy.coPrincipalInvestigator || "N/A"}
                </p>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium text-gray-800">
                  {consultancy.status}
                </p>
              </div>
            ))
          ) : (
            <p>No consultancy available</p>
          )}
        </div>
      </div>
    </div>
  );
}
