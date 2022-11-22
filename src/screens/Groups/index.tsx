import { useState, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { Alert, FlatList } from "react-native";

import { GroupCard } from "@components/GroupCard";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { Loading } from "@components/Loading";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";

import { Container } from "./styles";

import { groupsGetAll } from "@storage/group/groupsGetAll";

export function Groups() {
  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<string[]>([]);

  const navigation = useNavigation();

  function handleNewGroup() {
    navigation.navigate("new");
  }

  function handleOpenGroup(group: string) {
    navigation.navigate("players", { group });
  }

  async function fetchGroups() {
    try {
      setIsLoading(true);

      const data = await groupsGetAll();

      setGroups(data);
    } catch (error) {
      console.log(error);

      Alert.alert("Turmas", "Não foi possível carregar as turmas");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }

  useFocusEffect(
    useCallback(() => {
      // console.log("Use FocusEffect foi executado!!");

      fetchGroups();
    }, [])
  );

  return (
    <Container>
      <Header />
      <Highlight title="Turmas" subtitle="jogue com sua turma" />

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <GroupCard title={item} onPress={() => handleOpenGroup(item)} />
          )}
          contentContainerStyle={groups.length === 0 && { flex: 1 }}
          ListEmptyComponent={() => (
            <ListEmpty message="Que tal cadastrar sua primeira turma?" />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Button title="Criar nova turma" onPress={handleNewGroup} />
    </Container>
  );
}
