export const contratoAlquiler = {
  name: "Contrato de Alquiler",
  content: `
CONTRATO DE ARRENDAMIENTO DE VIVIENDA

En {{ciudad}}, a {{fecha}}

REUNIDOS

De una parte, {{nombre_arrendador}}, mayor de edad, con DNI {{dni_arrendador}}, y domicilio en {{domicilio_arrendador}}, en adelante "EL ARRENDADOR".

De otra parte, {{nombre_arrendatario}}, mayor de edad, con DNI {{dni_arrendatario}}, y domicilio actual en {{domicilio_arrendatario}}, en adelante "EL ARRENDATARIO".

INTERVIENEN

Ambas partes intervienen en su propio nombre y derecho, reconociéndose mutuamente la capacidad legal necesaria para el otorgamiento del presente contrato de arrendamiento de vivienda, y a tal efecto,

EXPONEN

I. Que EL ARRENDADOR es propietario de la vivienda situada en {{direccion_vivienda}}, con una superficie de {{superficie_vivienda}} metros cuadrados, que consta de {{descripcion_vivienda}}.

II. Que EL ARRENDATARIO está interesado en el arrendamiento de dicha vivienda para satisfacer su necesidad permanente de vivienda.

III. Que ambas partes han acordado celebrar el presente contrato de arrendamiento de vivienda, conforme a las siguientes:

CLÁUSULAS

PRIMERA - OBJETO
EL ARRENDADOR cede en arrendamiento a EL ARRENDATARIO la vivienda descrita en el Expositivo I, que será destinada a satisfacer la necesidad permanente de vivienda del arrendatario.

SEGUNDA - DURACIÓN
El plazo de duración del presente contrato es de {{duracion_contrato}} años, a contar desde el día {{fecha_inicio}}, por lo que concluirá el día {{fecha_fin}}.

TERCERA - RENTA
La renta anual será de {{renta_anual}} euros, pagaderos en mensualidades de {{renta_mensual}} euros cada una. El pago se efectuará dentro de los primeros {{dias_pago}} días de cada mes, mediante transferencia bancaria a la cuenta {{cuenta_bancaria}}.

CUARTA - FIANZA
A la firma de este contrato, EL ARRENDATARIO hace entrega a EL ARRENDADOR de la cantidad de {{importe_fianza}} euros, equivalente a {{meses_fianza}} mensualidades de renta, en concepto de fianza legal.

QUINTA - GASTOS
Serán de cuenta de EL ARRENDATARIO los gastos derivados del consumo de agua, electricidad, gas y cualquier otro suministro que se mida por contador individual.

SEXTA - CONSERVACIÓN Y OBRAS
EL ARRENDATARIO se obliga a mantener en buen estado de uso y conservación la vivienda arrendada, así como todas las instalaciones en ella existentes, efectuando las reparaciones necesarias para la debida conservación de la misma.

SÉPTIMA - PROHIBICIONES
Queda expresamente prohibido al arrendatario:
• Subarrendar o ceder total o parcialmente la vivienda.
• Realizar obras que modifiquen la configuración de la vivienda sin el consentimiento escrito del arrendador.
• Desarrollar actividades molestas, insalubres, nocivas, peligrosas o ilícitas.

OCTAVA - CAUSAS DE RESOLUCIÓN
Serán causas de resolución del presente contrato, además del incumplimiento de las obligaciones derivadas del mismo y las previstas en la LAU:
• La falta de pago de la renta o cantidades asimiladas.
• El incumplimiento de cualquiera de las prohibiciones establecidas en la cláusula séptima.
• La realización de daños causados dolosamente en la vivienda.

FIRMAS

Y en prueba de conformidad con cuanto antecede, firman las partes el presente contrato en duplicado ejemplar, en el lugar y fecha arriba indicados.


EL ARRENDADOR


EL ARRENDATARIO
  `,
  form_config: {
    groups: [
      {
        id: "datos_basicos",
        title: "Datos Básicos",
        variables: [
          "ciudad",
          "fecha",
          "fecha_inicio",
          "fecha_fin"
        ]
      },
      {
        id: "datos_arrendador",
        title: "Datos del Arrendador",
        variables: [
          "nombre_arrendador",
          "dni_arrendador",
          "domicilio_arrendador"
        ]
      },
      {
        id: "datos_arrendatario",
        title: "Datos del Arrendatario",
        variables: [
          "nombre_arrendatario",
          "dni_arrendatario",
          "domicilio_arrendatario"
        ]
      },
      {
        id: "datos_vivienda",
        title: "Datos de la Vivienda",
        variables: [
          "direccion_vivienda",
          "superficie_vivienda",
          "descripcion_vivienda"
        ]
      },
      {
        id: "condiciones_economicas",
        title: "Condiciones Económicas",
        variables: [
          "duracion_contrato",
          "renta_anual",
          "renta_mensual",
          "dias_pago",
          "cuenta_bancaria",
          "importe_fianza",
          "meses_fianza"
        ]
      }
    ]
  }
} 