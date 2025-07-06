"use client"

import { useState, useEffect } from "react"
import { Inter } from "next/font/google"
import Link from "next/link"

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

export default function UminDAO() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newProposal, setNewProposal] = useState({
    title: "",
    description: "",
    deadline: "",
  })
  const [userAddress] = useState("0x1234...5678")

  useEffect(() => {
    const mockProposals: Proposal[] = [
      {
        id: 1,
        title: "Protocol Infrastructure Upgrade",
        description: "Enhance core smart contract infrastructure for improved gas efficiency and scalability.",
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
        description: "Establish systematic allocation of treasury funds for ecosystem development.",
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
        description: "Form alliance with leading DeFi protocols to expand ecosystem reach.",
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
    setProposals(mockProposals)
  }, [])

  const handleCreateProposal = () => {
    if (!newProposal.title || !newProposal.description || !newProposal.deadline) {
      alert("Please fill in all fields")
      return
    }

    const proposal: Proposal = {
      id: proposals.length + 1,
      title: newProposal.title,
      description: newProposal.description,
      proposer: userAddress,
      voteYes: 0,
      voteNo: 0,
      createdAt: Date.now(),
      deadline: new Date(newProposal.deadline).getTime(),
      status: "Pending",
      donations: 0,
      withdrawn: false,
    }

    setProposals([...proposals, proposal])
    setNewProposal({ title: "", description: "", deadline: "" })
    setShowCreateForm(false)
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

  const getVotePercentage = (yes: number, no: number) => {
    const total = yes + no
    if (total === 0) return { yesPercent: 0, noPercent: 0 }
    return {
      yesPercent: Math.round((yes * 100) / total),
      noPercent: Math.round((no * 100) / total),
    }
  }

  return (
    <div className={`min-h-screen bg-black text-white ${inter.className}`}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="border-b border-gray-800 pb-12 mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold mb-3">UMIN</h1>
              <p className="text-gray-400 text-lg">Decentralized Governance Protocol</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">CONNECTED WALLET</div>
              <div className="font-mono text-white">{userAddress}</div>
            </div>
          </div>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="border border-gray-800 p-6">
            <div className="text-3xl font-bold mb-2">{proposals.length}</div>
            <div className="text-gray-400 text-sm">TOTAL PROPOSALS</div>
          </div>
          <div className="border border-gray-800 p-6">
            <div className="text-3xl font-bold mb-2">{proposals.filter((p) => p.status === "Active").length}</div>
            <div className="text-gray-400 text-sm">ACTIVE PROPOSALS</div>
          </div>
          <div className="border border-gray-800 p-6">
            <div className="text-3xl font-bold mb-2">
              {proposals.reduce((sum, p) => sum + p.donations, 0).toFixed(1)}
            </div>
            <div className="text-gray-400 text-sm">TOTAL DONATIONS (ETH)</div>
          </div>
          <div className="border border-gray-800 p-6">
            <div className="text-3xl font-bold mb-2">{proposals.reduce((sum, p) => sum + p.voteYes + p.voteNo, 0)}</div>
            <div className="text-gray-400 text-sm">TOTAL VOTES</div>
          </div>
        </div>

        {/* Create Proposal Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">GOVERNANCE PROPOSALS</h2>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-white text-black px-8 py-4 font-bold hover:bg-gray-200 transition-colors"
            >
              {showCreateForm ? "CANCEL" : "NEW PROPOSAL"}
            </button>
          </div>

          {showCreateForm && (
            <div className="border border-gray-800 p-8 mb-12 bg-gray-950">
              <h3 className="text-2xl font-bold mb-6">CREATE PROPOSAL</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-3 text-gray-300">PROPOSAL TITLE</label>
                  <input
                    type="text"
                    value={newProposal.title}
                    onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                    className="w-full bg-black border border-gray-700 p-4 text-white focus:border-white"
                    placeholder="Enter proposal title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-3 text-gray-300">DESCRIPTION</label>
                  <textarea
                    value={newProposal.description}
                    onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                    className="w-full bg-black border border-gray-700 p-4 text-white h-32 focus:border-white"
                    placeholder="Describe your proposal in detail"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-3 text-gray-300">VOTING DEADLINE</label>
                  <input
                    type="datetime-local"
                    value={newProposal.deadline}
                    onChange={(e) => setNewProposal({ ...newProposal, deadline: e.target.value })}
                    className="bg-black border border-gray-700 p-4 text-white focus:border-white"
                  />
                </div>
                <button
                  onClick={handleCreateProposal}
                  className="bg-white text-black px-8 py-4 font-bold hover:bg-gray-200 transition-colors"
                >
                  SUBMIT PROPOSAL
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Proposals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {proposals.map((proposal) => {
            const { yesPercent } = getVotePercentage(proposal.voteYes, proposal.voteNo)
            const totalVotes = proposal.voteYes + proposal.voteNo

            return (
              <Link key={proposal.id} href={`/proposal/${proposal.id}`}>
                <div className="border border-gray-800 p-8 hover:border-gray-600 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-gray-500 font-mono text-sm">
                          #{proposal.id.toString().padStart(3, "0")}
                        </span>
                        <div className={`px-3 py-1 text-xs font-bold text-black ${getStatusBg(proposal.status)}`}>
                          {proposal.status.toUpperCase()}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-gray-300 transition-colors">
                        {proposal.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2">{proposal.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <div className="text-sm text-gray-500 mb-2">VOTING PROGRESS</div>
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-bold">{yesPercent}%</div>
                        <div className="flex-1 bg-gray-800 h-2">
                          <div className="bg-green-400 h-2" style={{ width: `${yesPercent}%` }}></div>
                        </div>
                        <div className="text-sm text-gray-400">{totalVotes} votes</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-2">FUNDING</div>
                      <div className="text-lg font-bold">{proposal.donations} ETH</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div>
                      Proposed by <span className="font-mono">{proposal.proposer}</span>
                    </div>
                    <div>Deadline: {formatDate(proposal.deadline)}</div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {proposals.length === 0 && (
          <div className="text-center py-24">
            <div className="text-6xl mb-6">⚡</div>
            <h3 className="text-2xl font-bold mb-4">NO PROPOSALS YET</h3>
            <p className="text-gray-400 text-lg">Be the first to create a governance proposal</p>
          </div>
        )}
      </div>
    </div>
  )
}
