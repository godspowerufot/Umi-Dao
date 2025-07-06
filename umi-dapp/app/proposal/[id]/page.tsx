"use client"

import { useState, useEffect } from "react"
import { Inter } from "next/font/google"
import Link from "next/link"
import { useParams } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

interface Proposal {
  id: number
  title: string
  description: string
  proposer: string
  voteYes: number
  voteNo: number
  createdAt: number
  deadline: number
  status: "Pending" | "Active" | "Inactive"
  donations: number
  withdrawn: boolean
}

export default function ProposalDetail() {
  const params = useParams()
  const proposalId = Number.parseInt(params.id as string)
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [userAddress] = useState("0x1234...5678")
  const [hasVoted, setHasVoted] = useState(false)

  useEffect(() => {
    // Mock data - in real app this would come from blockchain
    const mockProposals: Proposal[] = [
      {
        id: 1,
        title: "Protocol Infrastructure Upgrade",
        description:
          "This proposal aims to enhance our core smart contract infrastructure to improve gas efficiency and scalability. The upgrade includes optimizing contract bytecode, implementing more efficient data structures, and adding new features that will benefit the entire ecosystem. The proposed changes have been thoroughly tested on testnets and reviewed by security auditors. Implementation timeline is estimated at 4-6 weeks with minimal disruption to existing operations.",
        proposer: "0xabcd...efgh",
        voteYes: 15,
        voteNo: 3,
        createdAt: Date.now() - 86400000,
        deadline: Date.now() + 172800000,
        status: "Pending",
        donations: 2.5,
        withdrawn: false,
      },
      {
        id: 2,
        title: "Treasury Allocation Framework",
        description:
          "Establish a systematic framework for allocating treasury funds to support ecosystem development, community initiatives, and strategic partnerships. This proposal outlines clear criteria for funding decisions, governance processes, and accountability measures to ensure responsible stewardship of community resources.",
        proposer: "0x9876...5432",
        voteYes: 8,
        voteNo: 12,
        createdAt: Date.now() - 259200000,
        deadline: Date.now() - 86400000,
        status: "Inactive",
        donations: 0,
        withdrawn: false,
      },
      {
        id: 3,
        title: "Strategic DeFi Partnership",
        description:
          "Form strategic alliance with leading DeFi protocols to expand our ecosystem reach and provide enhanced liquidity options for our users. This partnership will enable cross-protocol integrations, shared liquidity pools, and collaborative development of new financial products that benefit both communities.",
        proposer: "0x5555...7777",
        voteYes: 22,
        voteNo: 5,
        createdAt: Date.now() - 432000000,
        deadline: Date.now() - 172800000,
        status: "Active",
        donations: 8.3,
        withdrawn: false,
      },
    ]

    const foundProposal = mockProposals.find((p) => p.id === proposalId)
    setProposal(foundProposal || null)
  }, [proposalId])

  const handleVote = (support: boolean) => {
    if (!proposal) return

    setProposal({
      ...proposal,
      voteYes: support ? proposal.voteYes + 1 : proposal.voteYes,
      voteNo: !support ? proposal.voteNo + 1 : proposal.voteNo,
    })
    setHasVoted(true)
  }

  const handleFinalize = () => {
    if (!proposal) return

    const totalVotes = proposal.voteYes + proposal.voteNo
    const yesPercent = totalVotes > 0 ? (proposal.voteYes * 100) / totalVotes : 0

    setProposal({
      ...proposal,
      status: yesPercent >= 60 ? "Active" : "Inactive",
    })
  }

  const handleDonate = () => {
    const amount = prompt("Enter donation amount (ETH):")
    if (amount && !isNaN(Number(amount)) && proposal) {
      setProposal({
        ...proposal,
        donations: proposal.donations + Number(amount),
      })
    }
  }

  const handleWithdraw = () => {
    if (!proposal) return

    setProposal({
      ...proposal,
      withdrawn: true,
      donations: 0,
    })
  }

  if (!proposal) {
    return (
      <div className={`min-h-screen bg-black text-white ${inter.className} flex items-center justify-center`}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">PROPOSAL NOT FOUND</h1>
          <Link href="/" className="text-gray-400 hover:text-white">
            ← Back to Proposals
          </Link>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-green-400"
      case "Inactive":
        return "text-red-400"
      default:
        return "text-yellow-400"
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-400"
      case "Inactive":
        return "bg-red-400"
      default:
        return "bg-yellow-400"
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString()
  }

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const isExpired = (deadline: number) => {
    return Date.now() > deadline
  }

  const getVotePercentage = (yes: number, no: number) => {
    const total = yes + no
    if (total === 0) return { yesPercent: 0, noPercent: 0 }
    return {
      yesPercent: Math.round((yes * 100) / total),
      noPercent: Math.round((no * 100) / total),
    }
  }

  const { yesPercent, noPercent } = getVotePercentage(proposal.voteYes, proposal.voteNo)
  const totalVotes = proposal.voteYes + proposal.voteNo
  const expired = isExpired(proposal.deadline)

  return (
    <div className={`min-h-screen bg-black text-white ${inter.className}`}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12">
          <Link href="/" className="text-gray-400 hover:text-white mb-6 inline-block">
            ← Back to Proposals
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-gray-500 font-mono text-lg">#{proposal.id.toString().padStart(3, "0")}</span>
            <div className={`px-4 py-2 text-sm font-bold text-black ${getStatusBg(proposal.status)}`}>
              {proposal.status.toUpperCase()}
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">{proposal.title}</h1>
        </header>

        {/* Proposal Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="border border-gray-800 p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">PROPOSAL DETAILS</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed text-lg">{proposal.description}</p>
              </div>
            </div>

            {/* Voting Section */}
            <div className="border border-gray-800 p-8">
              <h2 className="text-2xl font-bold mb-6">VOTING</h2>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-green-400 font-bold">YES</span>
                    <span className="text-2xl font-bold">{proposal.voteYes}</span>
                  </div>
                  <div className="w-full bg-gray-800 h-4 mb-2">
                    <div className="bg-green-400 h-4" style={{ width: `${yesPercent}%` }}></div>
                  </div>
                  <div className="text-sm text-gray-400">{yesPercent}%</div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-red-400 font-bold">NO</span>
                    <span className="text-2xl font-bold">{proposal.voteNo}</span>
                  </div>
                  <div className="w-full bg-gray-800 h-4 mb-2">
                    <div className="bg-red-400 h-4" style={{ width: `${noPercent}%` }}></div>
                  </div>
                  <div className="text-sm text-gray-400">{noPercent}%</div>
                </div>
              </div>

              <div className="text-center mb-8">
                <div className="text-3xl font-bold mb-2">{totalVotes}</div>
                <div className="text-gray-400">TOTAL VOTES</div>
              </div>

              {/* Voting Actions */}
              {proposal.status === "Pending" && !expired && !hasVoted && (
                <div className="flex gap-4">
                  <button
                    onClick={() => handleVote(true)}
                    className="flex-1 bg-green-600 text-white py-4 font-bold hover:bg-green-700 transition-colors"
                  >
                    VOTE YES
                  </button>
                  <button
                    onClick={() => handleVote(false)}
                    className="flex-1 bg-red-600 text-white py-4 font-bold hover:bg-red-700 transition-colors"
                  >
                    VOTE NO
                  </button>
                </div>
              )}

              {hasVoted && <div className="text-center py-4 text-green-400 font-bold">VOTE SUBMITTED</div>}

              {proposal.status === "Pending" && expired && (
                <button
                  onClick={handleFinalize}
                  className="w-full bg-yellow-600 text-black py-4 font-bold hover:bg-yellow-700 transition-colors"
                >
                  FINALIZE PROPOSAL
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Proposal Info */}
            <div className="border border-gray-800 p-6">
              <h3 className="text-xl font-bold mb-6">PROPOSAL INFO</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">PROPOSER</div>
                  <div className="font-mono text-sm">{proposal.proposer}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">CREATED</div>
                  <div>{formatDateTime(proposal.createdAt)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">DEADLINE</div>
                  <div className={expired ? "text-red-400" : ""}>
                    {formatDateTime(proposal.deadline)}
                    {expired && " (EXPIRED)"}
                  </div>
                </div>
              </div>
            </div>

            {/* Funding */}
            <div className="border border-gray-800 p-6">
              <h3 className="text-xl font-bold mb-6">FUNDING</h3>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold mb-2">{proposal.donations}</div>
                <div className="text-gray-400">ETH RAISED</div>
                {proposal.withdrawn && <div className="text-yellow-400 text-sm mt-2">FUNDS WITHDRAWN</div>}
              </div>

              {proposal.status === "Active" && (
                <button
                  onClick={handleDonate}
                  className="w-full bg-blue-600 text-white py-3 font-bold hover:bg-blue-700 transition-colors mb-4"
                >
                  DONATE
                </button>
              )}

              {proposal.status === "Active" &&
                proposal.proposer === userAddress &&
                proposal.donations > 0 &&
                !proposal.withdrawn && (
                  <button
                    onClick={handleWithdraw}
                    className="w-full bg-purple-600 text-white py-3 font-bold hover:bg-purple-700 transition-colors"
                  >
                    WITHDRAW FUNDS
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
