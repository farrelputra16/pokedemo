/* eslint-disable react-hooks/exhaustive-deps */
import React, { createRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IMyPokemon } from "../../types/pokemon";
import { useGlobalContext } from "../../context";
import { generatePokeSummary, loadMyPokemonFromLocalStorage } from "../../helpers";
import { Button, Navbar, Text, Modal, PokeCard, DeleteButton } from "../../components";
import PokemonChatbot from "./PokemonChatbot";
import * as T from "./index.style";

const MyPokemon: React.FC = () => {
  const [pokemons, setPokemons] = useState<IMyPokemon[]>([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false);
  const [selectedPokemon, setSelectedPokemon] = useState<string>("");
  const [navHeight, setNavHeight] = useState<number>(0);
  const { setState } = useGlobalContext();
  const navRef = createRef<HTMLDivElement>();

  function loadMyPokemon() {
    const parsed = loadMyPokemonFromLocalStorage();
    setPokemons(parsed);
  }

  useEffect(() => {
    setNavHeight(navRef.current?.clientHeight as number);
    loadMyPokemon();
  }, []);

  function releasePokemon(nickname: string) {
    const newCollection = pokemons.filter((pokemon: IMyPokemon) => pokemon.nickname !== nickname);
    localStorage.setItem("pokegames@myPokemon", JSON.stringify(newCollection));
    loadMyPokemon();
    setState({ pokeSummary: generatePokeSummary(newCollection) });
  }

  return (
    <>
      <Modal open={deleteConfirmation} overlay="light">
        <T.DeleteConfirmationModal>
          <div className="pxl-border" style={{ textAlign: "left" }}>
            <Text>Are you sure you want to release {selectedPokemon}?</Text>
            <br />
            <Text>You'll have to catch another one and cannot undo this action</Text>
          </div>
          <div>
            <Button
              variant="light"
              onClick={() => {
                releasePokemon(selectedPokemon);
                setDeleteConfirmation(false);
              }}
            >
              Release
            </Button>
            <Button onClick={() => setDeleteConfirmation(false)}>Back</Button>
          </div>
        </T.DeleteConfirmationModal>
      </Modal>

      <T.Page style={{ marginBottom: navHeight }}>
        <T.Header>
          <Text as="h1" variant="darker" size="lg">
            My Pokemon
          </Text>
          <Text as="span" variant="darker" size="lg">
            Total: {pokemons.length}
          </Text>
        </T.Header>

        {pokemons?.length ? (
          <T.Grid>
            {pokemons?.length &&
              [...pokemons].reverse().map((pokemon: IMyPokemon) => (
                <T.WrapperCardList key={pokemon.nickname}>
                  <PokeCard name={pokemon.name} nickname={pokemon.nickname} sprite={pokemon.sprite}>
                    <DeleteButton
                      onClick={() => {
                        setSelectedPokemon(pokemon.nickname);
                        setDeleteConfirmation(true);
                      }}
                    />
                    {/* Tombol Chat dihapus dari sini */}
                  </PokeCard>
                </T.WrapperCardList>
              ))}
          </T.Grid>
        ) : (
          <T.EmptyState>
            <Text>You haven't caught any pokemon</Text>
            <Link to="/pokemons">
              <Button>Explore</Button>
            </Link>
          </T.EmptyState>
        )}
      </T.Page>

      <Navbar ref={navRef} />

      {/* Chatbot selalu muncul dengan daftar pokemons */}
      <PokemonChatbot pokemons={pokemons} />
    </>
  );
};

export default MyPokemon;