package com.homework.ellaeinarsen.hangmanee;

import android.content.SharedPreferences;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;

/**
 * Class Hangman is used to handle Hangman game data and operations that are possible in the game.
 * @author Ella Einarsen
 * @version 1.0
 */
public class Hangman {

    /*Key variables used to save object data */
    private static final String SH_IS_SAVED_KEY ="sh_saved_key";
    private static final String SH_WORD_KEY="sh_word_key";
    private static final String SH_RIGHT_KEY="sh_guessed_key";
    private static final String SH_WORD_LIST_KEY="sh_word_list_key";
    private static final String SH_TRIES_KEY="sh_tries_key";
    private static final String SH_WRONG_KEY="sh_wrong_key";


    /**
     * Maximal amount of number of tries that player can have when game begins.
     */
    public static final int NUMBER_OF_TRIES = 10;

    /**
     * Variable random is used to hold reference to object of class Random that is used to choose
     * random word from word list.
     */
    public static Random random = new Random();

    private String gameWord;
    private int tries;
    private ArrayList<String> wordList;
    private ArrayList<Character> correctLetters;
    private ArrayList<Character> wrongLetters;
    private ArrayList<Boolean> revealedLetters;

    /**
     * Creates Hangman game object with default list of wordList, initializes object array lists
     * variables of correctly and wrongly guessed letters with zero elements. A default list of
     * words is also assigned to the new object. Then calls method chooseRandomWord that assigns
     * random word from the list of wordList to be the game word and does necessary cleaning and
     * assignments of object variables for new game.
     */
    public Hangman(){
        setCorrectLetters(new ArrayList<Character>());
        setWrongLetters(new ArrayList<Character>());
        setRevealedLetters(new ArrayList<Boolean>());
        setWordList(createDefaultWordList());
        chooseRandomWord();
    }


    /**
     * Method recreateSavedHangman allows recreating a state of Hangman object using all the data
     * given in parameters and updating existing object with it.
     * @param wordList is the list of wordList that are to be used by Hangman object
     * @param wrongGuessedLetters   is the list of letters that are assigned as wrongly guessed
     * @param correctGuessedLetters is the list of letters that are assigned as correctly guessed
     * @param chosenWord is the chosen game word to be saved
     * @param triesRemaining is the amount of tries remaining (guess) assigned
     */
    private void recreateSavedHangman(ArrayList<String> wordList,
                                      ArrayList<Character> wrongGuessedLetters,
                                      ArrayList<Character> correctGuessedLetters,
                                      String chosenWord, int triesRemaining ){

        setWordList(wordList);
        setCorrectLetters(correctGuessedLetters);
        setWrongLetters(wrongGuessedLetters);
        setGameWord(chosenWord);
        setTries(triesRemaining);
        generateRevealedLettersInWord();
    }

    /**
     * Method setWordList assigns list of wordList to Hangman object replacing any other existing
     * list. The new list is converted to contain lower case words only.
     * @param newList new list of wordList to be used by game
     */
    private void setWordList(ArrayList<String> newList){
        if (wordList == null || newList.size()!= wordList.size() ){                                 // if object has no list or list of different size, update list
            wordList = toLowerCaseLetter(newList);
        } else {
            boolean b = true;
            for (String n : newList) {
                if (!wordList.contains(n.toLowerCase())){
                    b = false;
                    break;
                }
            }
            if (b) {                                                                                // if new list contains a word that old one doesn't have then update list
                wordList = toLowerCaseLetter(newList);
            }
        }
    }

    /**
     * This method is used when new game is created with generic list of wordList in Hangman class.
     * It is done only once at object creation.
     */
    private ArrayList<String> createDefaultWordList(){
        ArrayList<String> words= new ArrayList<String>() {{
            add("sunrise");
            add("winter");
            add("human");
            add("robot");
            add("earth");
            add("moon");
            add("planet");
            add("election");
            add("evolution");
            add("ape");
        }};
        return words;
    }

    /**
     * Method setGameWord assign given String input variable to be new game word.
     * @param chosenWord is the word to replace existing game word
     */
    private void setGameWord(String chosenWord){
        gameWord = chosenWord;
    }

    /**
     * Method setTries allows free change of value of the remaining tries for Hangman
     * game object. Given integer input is assigned to tries variable.
     * @param triesRemaining integer number of remaining tries in game
     */
    private void setTries(int triesRemaining){
        tries = triesRemaining;
    }

    /**
     * This method is used to assign list of correctly guessed letters to existing objects list
     * of correct letters by replacing it.
     * @param arrayList is the list that will be assigned to array of correctly guessed letters.
     */
    private void setCorrectLetters(ArrayList<Character> arrayList){
        correctLetters = arrayList;
    }

    /**
     * Method setWrongLetters takes Character ArrayList as input parameter and replaces objects
     * existing list of wrong letters with it.
     * @param arrayList of letters to replace list with wrongly guessed letters
     */
    private void setWrongLetters(ArrayList<Character> arrayList){
        wrongLetters = arrayList;
    }

    /**
     * Method setRevealedLetters takes Boolean array list as input and replaces existing list of
     * revealed letters with it.
     * @param arrayList new Boolean array list to replace true/false list corresponding to game word
     */
    private void setRevealedLetters(ArrayList<Boolean> arrayList){
        revealedLetters = arrayList;
    }

    /**
     * Method generateRevealedLettersInWord assigns Boolean array list to correspond to guessed
     * and hidden letters in gameWord. For every letter that has been guessed its place in Boolean
     * array list is saved as true while for every yet to be guessed letter its place is saved as
     * false value.
     */
    private void generateRevealedLettersInWord(){
        if (revealedLetters !=null){                                                                // clear if contains old data from earlier game
            revealedLetters.clear();
        }
        for(int i=0; i<gameWord.length();i++){
            revealedLetters.add(correctLetters.contains(gameWord.charAt(i)));
        }
    }



    /**
     * Method chooseRandomWord assigns a random word from wordList to be the word used in
     * Hangman game instance. Choice is generated with help of Random class which generates random
     * integer  which represents one of the words in array list wordList. This method also resets
     * values of wrongly guessed letters, correctly guessed letters, remaining tries and revealed
     * letters for Hangman object as these are interconnected in game logic.
     */
    public void chooseRandomWord(){
        setGameWord(wordList.get(random.nextInt(wordList.size())));
        correctLetters.clear();
        wrongLetters.clear();
        generateRevealedLettersInWord();
        tries = NUMBER_OF_TRIES;
        for( int i=0 ; i<getGameWord().length(); i++){                                              // revealedLetters is being re-generated to fit new game word
            revealedLetters.add(false);
        }
    }

    /**
     * Method makeAGuess takes a letter (character) as input and runs necessary methods to check if
     * the letter has been used or not. If the letter has already been used (wrongly or correctly)
     * then nothing happens. If the letter has not been used then method runs a
     * check if that letter is one of letters in game word. If that is not the case then it is added
     * to used letters and remaining tries are decreased by one. If the letter has not been used yet
     * and it matches one (or more) letters in the game word then it is added to correctly used
     * letters.
     * @param letter that is to be checked by game
     */
    public void makeAGuess(char letter){
        letter = toLowerCaseLetter(letter);                                                         //matches lower case wordList for easy equality check
        if( !hasUsedLetter(letter)) {
            if(gameWord.contains(Character.toString(letter)) ){
                for (int i=0; i<gameWord.length();i++){                                             //replace every false with true at i position when letter matches one in game word
                    if (gameWord.charAt(i)==letter){
                        revealedLetters.set(i, true);
                    }
                }
                correctLetters.add(letter);
            }
            else {
                wrongLetters.add(letter);
                if (tries <=0){
                    tries = 0;
                } else {
                    tries--;
                }
            }
        }
    }

    /**
     * Method getHiddenWord returns string variable that represent game word with all guessed letters
     * revealed and with not yet guessed letters replaced by "-" sign.
     * @return string containing game word with all not guessed letters replaced by -
     */
    public String getHiddenWord(){
        String hiddenWord="";
        for (int i= 0;i<gameWord.length();i++){
            if(revealedLetters.get(i)){
                hiddenWord+= gameWord.charAt(i);
            }
            else {
                hiddenWord+="-";
            }
        }
        return hiddenWord;
    }

    /**
     * If Hangman object has no tries remaining left (0) then this method returns true, else false.
     * @return boolean value true if there are no more tries left, else false
     */
    public boolean hasLost(){
        return (tries <=0);
    }

    /**
     * This method checks if all letters in game word has been guessed correctly and returns true
     * if it is the case, else false.
     * @return true if game word has been guessed, else false
     */
    public boolean hasWon() {
        return (gameWord.equals(getHiddenWord()));
    }

    /**
     * Method hasUsedLetter checks if the entered character parameter has already been used and
     * saved in respective array list variables. Method returns true if the letter has been used,
     * else false.
     * @param letter is letter to be checked if used
     * @return true or false boolean value depending on if the parameter letter has been already used
     */
    public boolean hasUsedLetter(char letter){
        return ( correctLetters.contains(letter) || wrongLetters.contains(letter));
    }

    /**
     * Method returns the current game word in Hangman class object.
     * @return game word that is to be guessed by player
     */
    public String getGameWord(){
        return gameWord;
    }

    /**
     * Method getTries returns integer number of tries (guess chances) left.
     * @return number of tries left
     */
    public int getTries(){
        return tries;
    }

    /**
     * Method getWrongLetters goes through array list of wrongly guessed characters(letters)
     * and returns them as one string variable where all letters are separated by comma.
     * @return string variable containing all wrongly guessed letters
     */
    public String getWrongLetters(){
        String wrongLetters="";

        for (int i=0; i< this.wrongLetters.size();i++){
            if (i<( this.wrongLetters.size()-1) ){                                                  // no comma after last letter
                wrongLetters+=(this.wrongLetters.get(i)+", ");

            } else{
                wrongLetters+=(this.wrongLetters.get(i));
            }
        }
        return wrongLetters;
    }

    /**
     * Method saveGameState saves all needed Hangman object information in Shared Preferences object
     * referencing to a file. This method fetches the important data from actual object that was used
     * to call method and does necessary conversions to data and saves that data in the file in
     * assigned key-value pairs containing both String and String Set values.
     * @param sh is reference to SharedPreferences object that is assigned to write to a file
     */
    public void saveGameState(SharedPreferences sh){
        SharedPreferences.Editor editor;
        editor = sh.edit();
        editor.putStringSet(SH_WORD_LIST_KEY, new HashSet<String>(wordList));
        editor.putStringSet(SH_WRONG_KEY, charAListToStringSet(wrongLetters));
        editor.putStringSet(SH_RIGHT_KEY, charAListToStringSet(correctLetters));
        editor.putString(SH_WORD_KEY, gameWord);
        editor.putInt(SH_TRIES_KEY, tries);
        editor.putBoolean(SH_IS_SAVED_KEY, true);                                                      // says that there is saved object data
        editor.commit();
    }

    /**
     * Method loadGameState updates existing objects data with loaded data from file referenced by
     * SharedPreferences attribute. This method loads data only if there are existent, corresponding
     * Key-value pairs saved in SharedPreference file. A check for saved state key-value pair is
     * done and if it is not existent in a file then no data will be read. If this key-value pair
     * exists and is set as true then loading of game data will be attempted.
     * @param sh reference to object of SharedPreferences class that is linked to a file from which
     *           data will be read
     */
    public void loadGameState(SharedPreferences sh){
        if(sh.getBoolean(SH_IS_SAVED_KEY, false)){

            ArrayList<String> wordList = new ArrayList<String>(sh.getStringSet(SH_WORD_LIST_KEY,
                                                            new HashSet<String>(this.wordList)));

            ArrayList<Character> wrongLetters = stringSetToCharAList(sh.getStringSet(SH_WRONG_KEY,
                                                      charAListToStringSet(this.wrongLetters)));

            ArrayList<Character> rightLetters = stringSetToCharAList(sh.getStringSet(SH_RIGHT_KEY,
                                                      charAListToStringSet(correctLetters)));

            String word = sh.getString(SH_WORD_KEY, gameWord);
            int tries = sh.getInt(SH_TRIES_KEY, this.tries);
            recreateSavedHangman(wordList,wrongLetters, rightLetters,word,tries);
        }
    }


    /*Object independent methods */

    /**
     * Method removeSavedState takes Shared Preferences object with assigned to it file and removes
     * any key-value pairs that have same names as those corresponding to Hangman class. Data being
     * removed is not object specific but it is the data saved in file.
     * @param sh is Shared Preferences object reference to read file with
     */
    public static void removeSavedState(SharedPreferences sh){
        if(sh.getBoolean(SH_IS_SAVED_KEY, false)){
            SharedPreferences.Editor editor;
            editor = sh.edit();
            editor.remove(SH_WORD_LIST_KEY);
            editor.remove(SH_WRONG_KEY);
            editor.remove(SH_RIGHT_KEY);
            editor.remove(SH_WORD_KEY);
            editor.remove(SH_TRIES_KEY);
            editor.remove(SH_IS_SAVED_KEY);
            editor.commit();
        }
    }

    /**
     * Method toLowerCaseLetter takes in array list of String values as parameter and returns that
     * array list with every String element changed to lower case.
     * @param arrayList list containing String values
     * @return array list containing String elements with lower case
     */
    public static ArrayList<String> toLowerCaseLetter(ArrayList<String> arrayList){
        for (int i =0;i< arrayList.size();i++) {
            arrayList.set(i,arrayList.get(i).toLowerCase());
        }
        return arrayList;
    }

    /**
     * Method toLowerCaseLetter takes character parameter and if it represents an upper case letter
     * then it returns that character turned to lower case.
     * @param c a letter (character) to be changed from upper to lower case
     * @return same letter but in lower case
     */
    public static char toLowerCaseLetter(char c){
        String s = (String.valueOf(c)).toLowerCase();
        if (s.charAt(0) != c ){
            c = s.charAt(0);
        }
        //System.out.println(s+" is saved in String after lower case. c is now "+c); // just a check
        return c;
    }

    /**
     * Method charAListToStringSet converts Array List of Characters to a Set of Strings and returns
     * it.
     * @param charList is ArrayList of Characters
     * @return a Set of String with same elements as the ones in the list given in parameter
     */
    public static Set<String> charAListToStringSet(ArrayList<Character> charList){
        Set<String> set = new HashSet<String>();
        ArrayList<String> convertedList = new ArrayList<String>();      // first change Character Array to String Array
        for (char c: charList){
            convertedList.add(String.valueOf(c));
        }
        set.addAll(convertedList);                                 // add newly created String Array to new HashSet
        return set;
    }

    /**
     * Method stringSetToCharAList takes a Set of String and returns a converted version of it as
     * an Array List of Characters.
     * @param set is Set of String to be converted
     * @return an Array List of String containing corresponding Character elements to ones in param
     */
    public static ArrayList<Character> stringSetToCharAList(Set<String> set){
        ArrayList<String> stringArrayList = new ArrayList<String>(set);
        ArrayList<Character> charArrayList = new ArrayList<Character>();
        for(String s: stringArrayList){
            charArrayList.add(s.charAt(0));
        }
        return charArrayList;
    }



}
