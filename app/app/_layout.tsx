import { NavigationIndependentTree } from '@react-navigation/native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import App from '../src/App';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <NavigationIndependentTree>
      <App />
    </NavigationIndependentTree>
  );
}
