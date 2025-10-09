import styles from './App.module.css';
import { SkillTreeLoader } from './Components/SkillTree/skill-tree-loader';
import data from './data.json';

function App() {
  return (
    <div className={styles.app}>
      <div className={styles.border}>
        <div className={styles.shadow}>
          <h1 className={styles.title}>Minecraft</h1>
          <div className={styles.container}>
            <SkillTreeLoader data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
