export function validarComponente(body: any) {
  if (!body.nome) throw new Error("Nome é obrigatório.");
  if (!body.sigla) throw new Error("Sigla é obrigatória.");
  if (!body.disciplina_id) throw new Error("Disciplina é obrigatória.");
  if (!body.tipo_media) throw new Error("Tipo de média é obrigatório.");
  
  if (body.tipo_media === "PONDERADA") {
    if (body.peso === undefined || body.peso === null)
      throw new Error("Peso é obrigatório para média ponderada.");

    if (body.peso <= 0 || body.peso > 100)
      throw new Error("Peso deve ser entre 1 e 100.");
  }
}
