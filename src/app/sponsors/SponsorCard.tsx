import React from 'react'
import './SponsorCard.css'

interface SponsorCardProps {
  title: string;
  logo: string;
  name: string;
  tagline: string;
}

function SponsorCard({ title, logo, name, tagline }: SponsorCardProps) {
  return (
    <article className="sponsor-card">
      <h3>{title}</h3>
      <img src={logo} alt={name} />
      <p>{name}</p>
      <small>{tagline}</small>
    </article>
    
  )
}

export default SponsorCard
