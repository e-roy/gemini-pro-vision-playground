export const settings_data = {
  temperature: {
    label: "Temperature",
    hoverText: `Temperature controls the degree of randomness in token selection.
          Lower temperatures are good for prompts that expect a true or correct
          response, while higher temperatures can lead to more diverse or
          unexpected results. With a temperature of 0 the highest probability
          token is always selected. For most use cases, try starting with a
          temperature of 0.2.`,
    step: 0.1,
    max: 1,
  },
  maxLength: {
    label: "Maximum Length",
    hoverText: `Token limit determines the maximum amount of text output from one
          prompt. A token is approximately four characters. The default value is
          2048.`,
    step: 10,
    max: 2048,
  },
  topP: {
    label: "Top P",
    hoverText: `Top-p changes how the model selects tokens for output. Tokens are
          selected from most probable to least until the sum of their
          probabilities equals the top-p value. For example, if tokens A, B, and
          C have a probability of .3, .2, and .1 and the top-p value is .5, then
          the model will select either A or B as the next token (using
          temperature). The default top-p value is .8.`,
    step: 0.1,
    max: 1,
  },
  topK: {
    label: "Top K",
    hoverText: `Top-k changes how the model selects tokens for output. A top-k of 1
          means the selected token is the most probable among all tokens in the
          model’s vocabulary (also called greedy decoding), while a top-k of 3
          means that the next token is selected from among the 3 most probable
          tokens (using temperature). The default top-k value is 40.`,
    step: 1,
    max: 40,
  },
};
