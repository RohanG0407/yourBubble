
from selenium import webdriver
import time
import json
from firebase import firebase






def UIUCextractData():

    driver = webdriver.Chrome(executable_path='C:/users/saath/desktop/chromedriver.exe')
    driver.get("https://go.illinois.edu/COVIDTestingData")
    time.sleep(5)
    html = driver.page_source

    input = driver.find_elements_by_class_name("single-result")[1]
    sevenDayAverage = input.text
    """
    action = webdriver.ActionChains(driver)
    action.move_to_element(input)
    action.perform()

    elements = driver.find_elements_by_xpath("//i[@class='icon-export']")[1]
    elements.click()

    time.sleep(0.5)

    elements = driver.find_element_by_xpath("//span[@class='link-label']")
    elements.click()

    time.sleep(0.5)

    elements = driver.find_elements_by_xpath("//a[@class='synthetic-select ']")[2]
    elements.click()
    elements = driver.find_element_by_xpath("//input[@name='fileName']")
    elements.send_keys("file")

    time.sleep(0.5)

    elements = driver.find_element_by_xpath("//a[@class='btn btn-primary modal-btn-primary']")
    elements.click()

    time.sleep(2)
    """


    array = []
    with open('C:/users/saath/downloads/file.json') as f:
        for line in f:
            dictionary = json.loads(line)
            try:
                x = (dictionary['result']['7 Day Positivity Avg'])
                array.append(float(x))
            except:
                pass

    average = sum(array) / len(array)
    driver.close()
    return [sevenDayAverage[0:4], round(average, 2)]




def AmherstExtractData():
    driver = webdriver.Chrome(executable_path='C:/users/saath/desktop/chromedriver.exe')
    driver.get("https://www.umass.edu/coronavirus/dashboard")
    time.sleep(4)

    frame = driver.find_element_by_xpath("//iframe[@id='myIframe']")
    driver.switch_to.frame(frame)

    sevenDayAverage = driver.find_elements_by_class_name("card-content")[5].text
    cumulativeDayAverage = driver.find_elements_by_class_name("card-content")[3].text
    driver.close()
    return [sevenDayAverage[(len(sevenDayAverage) - 4) : len(sevenDayAverage) - 1], cumulativeDayAverage[(len(cumulativeDayAverage) - 4) : len(cumulativeDayAverage) - 1]]


def RPIExtractData():
    driver = webdriver.Chrome(executable_path='C:/users/saath/desktop/chromedriver.exe')
    driver.get("https://covid19.rpi.edu/dashboard")
    time.sleep(4)

    sevenDayCount = int(driver.find_elements_by_class_name("field__item")[9].text.split("\n")[0].replace(",", ""))
    sevenDayTotal = int(driver.find_elements_by_class_name("field__item")[15].text.split("\n")[0].replace(",", ""))
    cumDayCount = int(driver.find_elements_by_class_name("field__item")[12].text.split("\n")[0].replace(",", ""))
    cumDayTotal = int(driver.find_elements_by_class_name("field__item")[18].text.split("\n")[0].replace(",", ""))


    driver.close()
    return [round((sevenDayCount / sevenDayTotal) * 100, 2), round((cumDayCount / cumDayTotal) * 100, 2)]

def COOLMETHOD():
    driver = webdriver.Chrome(executable_path='C:/users/saath/desktop/chromedriver.exe')
    driver.get("https://www.urbandictionary.com/define.php?term=Rohan&page=12")
    time.sleep(8)
    driver.execute_script("window.scrollTo(0, 900)")
    time.sleep(3)

if __name__ == '__main__':
    firebase = firebase.FirebaseApplication('https://yourbubble-69f44-default-rtdb.firebaseio.com', None)

    new_user = 69
    result = firebase.patch('/coviddata/rpi', {'7 Day Average': f"{RPIExtractData()[0]}%", 'Cumulative Average': f"{RPIExtractData()[1]}%"})
    result = firebase.patch('coviddata/uiuc', {'7 Day Average': f"{UIUCextractData()[0]}%", 'Cumulative Average': f"{UIUCextractData()[1]}%"})
    result = firebase.patch('coviddata/umass', {'7 Day Average': f"{AmherstExtractData()[0]}%", 'Cumulative Average': f"{AmherstExtractData()[1]}%"})


