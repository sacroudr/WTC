interface MapLivraisonProps {
  livraisonId: number;
}

const MapLivraison: React.FC<MapLivraisonProps> = ({ livraisonId }) => {
  return (
    <div>
      {/* Ta logique d'affichage de la carte ici */}
      <p>Carte de la livraison n°{livraisonId}</p>
    </div>
  );
};

export default MapLivraison;
