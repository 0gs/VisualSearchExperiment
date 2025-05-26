import json
import pandas as pd
import numpy as np

file_path = "final_data.json"
with open(file_path, 'r', encoding='utf-8') as f:
   data = json.load(f)

if not isinstance(data, list):
   data = [data]

all_demographics = []
all_reaction_trials = []
all_search_trials = []
participant_overview = []

# Katram dalībniekam
for i, participant_data in enumerate(data):
   participant_id = i + 1   
   demographics = participant_data.get('demographics', {})
   if demographics:
       demographics['participant_id'] = participant_id
       all_demographics.append(demographics)
   
   reaction_trials = participant_data.get('reaction_trials', [])
   for j, trial in enumerate(reaction_trials):
       trial['participant_id'] = participant_id
       trial['reaction_trial_number'] = j + 1
   all_reaction_trials.extend(reaction_trials)
   
   search_trials = participant_data.get('search_trials', [])
   
   search_time_elapsed = None
   if len(search_trials) >= 2:
       first_search_time = search_trials[0].get('time_elapsed', 0)
       last_search_time = search_trials[-1].get('time_elapsed', 0)
       search_time_elapsed = last_search_time - first_search_time
   
   overview_info = {
       'participant_id': participant_id,
       'total_reaction_trials': len(reaction_trials),
       'total_search_trials': len(search_trials),
       'search_time_elapsed_ms': search_time_elapsed,
       'search_time_elapsed_minutes': search_time_elapsed / 60000 if search_time_elapsed else None,
   }
   
   feedback = participant_data.get('feedback', {})
   if feedback:
       overview_info.update({
           'difficulty_rating': feedback.get('difficulty_rating', ''),
           'easiest_combo': feedback.get('easiest_combo', ''),
           'hardest_combo': feedback.get('hardest_combo', ''),
           'comments': feedback.get('comments', '')
       })
   
   participant_overview.append(overview_info)
   
   for j, trial in enumerate(search_trials):
       trial['participant_id'] = participant_id
       trial['search_trial_number'] = j + 1
       
       difficulty = trial.get('difficulty', '')
       target_present = trial.get('target_present', False)
           
       if len(search_trials) > 0:
           trial['time_from_search_start'] = trial.get('time_elapsed', 0) - search_trials[0].get('time_elapsed', 0)
   
   all_search_trials.extend(search_trials)
   
demographics_df = pd.DataFrame(all_demographics) if all_demographics else pd.DataFrame()
reaction_df = pd.DataFrame(all_reaction_trials) if all_reaction_trials else pd.DataFrame()
search_df = pd.DataFrame(all_search_trials) if all_search_trials else pd.DataFrame()
overview_df = pd.DataFrame(participant_overview)

demographics_df.to_csv('data1.csv', index=False, encoding='utf-8-sig')
reaction_df.to_csv('data2.csv', index=False, encoding='utf-8-sig')
search_df.to_csv('data3.csv', index=False, encoding='utf-8-sig')
overview_df.to_csv('data5.csv', index=False, encoding='utf-8-sig')

# Viss tiek saglabāts vienā Excel (.xlsx) failā
with pd.ExcelWriter('data.xlsx', engine='openpyxl') as writer:
   overview_df.to_excel(writer, sheet_name='Participant_Overview', index=False)
   demographics_df.to_excel(writer, sheet_name='Demographics', index=False)
   reaction_df.to_excel(writer, sheet_name='Reaction_Trials', index=False)
   search_df.to_excel(writer, sheet_name='Search_Trials', index=False)

print(f"Datu apstrāde bija veiksmīgi! Tika apstrādāti {len(data)} dalībnieki ar {len(all_search_trials)} vizuālās meklēšanas uzdevumu mēģinājumiem.")