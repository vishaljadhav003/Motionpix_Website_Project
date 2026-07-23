const TeamCard = ({ member }) => {
  return (
    <div className="team-card">
      <div className="team-image-wrapper">
        <img src={member.image} alt={member.name} />
      </div>

      <div className="team-info">
        <h4>{member.name}</h4>
        <p className="role">{member.role}</p>
        <span className="location">{member.location}</span>
      </div>
    </div>
  );
};

export default TeamCard;
