import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fonts } from '../theme';

export const loginScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center', // ✅ centre verticalement
  },
  headerContainer: {
    marginTop:40,
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingTop: spacing.xLarge,
    paddingBottom: spacing.medium,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.medium,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  logo: {
    width: 80,
    height: 80,
  },
  welcomeText: {
    fontSize: fontSizes.xLarge,
    fontFamily: fonts.heading,
    color: colors.text,
    marginBottom: spacing.xSmall,
  },
  subtitleText: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: spacing.large,
    alignItems: 'center', // ✅ centre horizontalement
    marginTop: spacing.medium,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.large,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    width: '100%',
    maxWidth: 400, // ✅ largeur max pour limiter l'étalement
  },
  inputContainer: {
    marginBottom: spacing.medium,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
  },
  inputIcon: {
    marginRight: spacing.small,
  },
  input: {
    flex: 1,
    fontSize: fontSizes.medium,
    fontFamily: fonts.regular,
    color: colors.text,
    paddingVertical: spacing.small,
  },
  eyeIcon: {
    paddingLeft: spacing.small,
  },
  helpText: {
    fontSize: fontSizes.small,
    color: colors.textSecondary,
    textAlign: 'center',
    fontFamily: fonts.regular,
    lineHeight: 20,
  },

  loginButtonWrapper: {
  borderRadius: 10,
  overflow: 'hidden',
  },
  loginButton: {
    borderRadius: 10,
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.large,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    marginRight: spacing.small,
  },
  dividerContainer: {
    marginTop: spacing.large,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.medium,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#DEE2E6',
  },
  dividerText: {
    marginHorizontal: spacing.small,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },
  alternativeOptions: {
    marginTop: spacing.small,
  },
});
