[//]: # (title: 將您的程式庫發佈到 npm – 教學)

<tldr>
<p>使用 <a href="https://npm-publish.petuska.dev/latest/">npm-publish Gradle 外掛程式</a>，透過手動或使用 GitHub Actions 將您的 Kotlin 多平台程式庫發佈到 npm。</p>
</tldr>

若要發佈您的程式庫，您需要：

1. 準備憑據，包括 [npm 帳戶](https://docs.npmjs.com/creating-a-new-npm-user-account) 和 [存取權杖 (access token)](https://docs.npmjs.com/creating-and-viewing-access-tokens)。
2. 在您的 Kotlin 多平台專案中設定發佈外掛程式。
3. 將憑據提供給發佈外掛程式，或為持續整合設定受信任的發佈者 (Trusted Publisher)。
4. 執行發佈任務，不論是手動或使用 CI。

在本教學中，我們使用 GitHub 來託管專案，並透過 GitHub Actions 執行 CI。

## 範例程式庫

您可以使用 [範例程式庫專案](https://github.com/Kotlin/kotlin-multiplatform-web-library)
來跟隨步驟並查看可運作的配置。

如果您重用該程式碼，請務必**將所有範例值替換為**您專案特定的值。

## 準備帳戶與憑據

若要發佈到 npm，您需要[登入 npm 門戶網站](https://www.npmjs.com/login)。

在本教學中，您將需要一個組織和一個存取權杖來設定手動發佈。

### 建立一個簡單的組織

在本教學中，我們將程式庫發佈在 npm 組織下，以避免名稱衝突。

要建立新組織，請參閱 [npm 文件](https://docs.npmjs.com/creating-an-organization)。

### 產生存取權杖

要手動發佈到 npm，您需要一個存取權杖，允許在您新建立的組織下發佈套件。
要產生此類權杖，請參閱 [npm 指南](https://docs.npmjs.com/creating-and-viewing-access-tokens)。

對於本教學，請使用簡化的安全配置：
* 啟用 **Bypass two-factor authentication (2FA)**（繞過雙重身分驗證）選項。
* 將權杖的一般權限和組織權限均設定為 **Read and write**（讀取與寫入）。

## 設定程式庫專案

如果您使用 [範例專案](https://github.com/Kotlin/kotlin-multiplatform-web-library)，
請在發佈前更新預設名稱。
這包括：

* 程式庫模組的名稱。
* 在 `settings.gradle.kts` 檔案中設定的專案名稱。 

設定好名稱後，請按照後續步驟設定發佈。

### 設定發佈外掛程式

本教學使用官方的 [npm-publish 外掛程式](https://github.com/Kotlin/npm-publish)
來協助發佈到 npm。
要了解更多關於該外掛程式及其可用配置選項的資訊，請參閱[外掛程式文件](https://npm-publish.petuska.dev)。

將外掛程式新增到您的 Kotlin 多平台專案中：

1. 開啟程式庫模組的 `build.gradle.kts` 檔案。

2. 在 `plugins {}` 區塊中新增以下行： 

    ```kotlin
    // <module directory>/build.gradle.kts
    
    plugins {
        kotlin("npm-publish") version "%npmPublishPlugin%"
    }
    ```
    
    > 有關該外掛程式的最新可用版本，請查看 [Releases](https://github.com/Kotlin/npm-publish/releases) 頁面。
    > 
    {style="note"}

3. 新增以下配置。
   請務必根據您的程式庫自訂值。
   唯一必要的參數是 `organization`、`authToken`、`packageName` 和 `version`。
   其餘部分作為擴展範例提供：

    ```kotlin
    // <module directory>/build.gradle.kts
    npmPublish {
        organization = "organization_name_without_the_@_sign"
        
        registries {
            npmjs {
                // 當您執行發佈套件的指令時，
                // 您將透過此環境變數傳遞您的 npm 權杖
                authToken = System.getenv("NPM_TOKEN")
            }
        }
    
        packages {
            named("js") {
                version = "0.0.1"
                packageName = "greetings"
                readme = file("../README.md")
    
                packageJson {
                    license = "Apache 2.0"
                    homepage = "https://github.com/Kotlin/kotlin-multiplatform-web-library#readme"
                    description = "Shared Kotlin/JS Greetings library"
                    keywords = listOf("kotlin", "kotlin-js", "greetings", "shared", "api")
                    author {
                        name = "Kotlin Developer Advocate"
                        url = "https://github.com/kotlin-hands-on/"
                    }
                    contributors = listOf(
                        Person {
                            name = "John Smith"
                            email = "john.smith@example.com"
                            url = "https://github.com/johnsmith"
                        },
                    )
                    repository {
                        type = "git"
                        url = "https://github.com/Kotlin/kotlin-multiplatform-web-library.git"
                    }
                }
            }
        }
    }
    ```

    > 要配置此項，您也可以使用 [Gradle 屬性](https://docs.gradle.org/current/userguide/build_environment.html)。
    > 
    {style="tip"}

`npmPublish {}` 區塊中的重要設定如下：

* `organization` 參數和 `registries {}` 區塊指定了身分驗證詳細資訊。
  在這種情況下，我們使用主要的 npm 存儲庫，
  以及在執行發佈任務時應持有權杖的 `NPM_TOKEN` 變數名稱。
* `packageName` 和 `version` 參數定義了必要的套件選項：
  * 可以省略 `version` 參數，以使用模組的版本作為預設值。
  * 可以省略 `packageName` 參數，以使用模組的名稱作為預設值。
* `packageJson {}` 區塊持有各種元資料。

## 手動發佈

當您仍在嘗試專案結構，或想要自行實作發佈自動化時，手動發佈會非常有用。

現在您可以從本機電腦將程式庫發佈到 npm。
若要執行此操作，請執行以下指令，並將您之前產生的存取權杖貼到 `YOUR_ACCESS_TOKEN` 的位置：

```bash
NPM_TOKEN=YOUR_ACCESS_TOKEN ./gradlew :shared:publishJsPackageToNpmjsRegistry
```

發佈程式庫後，您應該能夠在 npm 存儲庫中看到它。
開啟您的 npm 組織頁面並檢查 **Packages** 分頁
（但不是在您的個人 **Packages** 頁面）。

![npm 上已發佈的程式庫](published-on-npm.png){width=700}

### 疑難排解

手動發佈時經常出錯的幾件事：

* 留意 `build.gradle.kts` 配置中的 `version` 欄位：
  如果套件已使用相同或更早的版本發佈過，npm 會發佈失敗。
* 產生針對組織作用域 (organization-scoped) 套件的權杖時，
  請確保同時設定一般權限**和**組織權限。

## 使用持續整合 (CI) 發佈

npm 的受信任的發佈者 (Trusted Publishers) 機制允許您使用 OpenID Connect 快速設定 CI。
這種方法可以完全避免產生和維護權杖。

在此範例中，我們將使用 [GitHub Actions](https://docs.github.com/en/actions) 設定工作流程。

### 建立 GitHub Actions 工作流程檔案

建立 `.github/workflows/publish.yml` 檔案來設定 GitHub action：

```yaml
# .github/workflows/publish.yml

name: Publish

on:
  release:
    types: [released, prereleased]

permissions:
  id-token: write  # GitHub Actions 與 npm 受信任發佈整合
                   # 所需的權限
  contents: read

jobs:
  publish:
    name: Release build and publish
    runs-on: ubuntu-latest
    steps:
      # 檢出觸發的分支
      - name: Check out code
        uses: actions/checkout@v4

      # 設定 JDK 以執行 Gradle 任務
      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: 21

      # 為程式庫模組執行發佈 Gradle 任務
      - name: Publish to npm
        run: ./gradlew :shared:publishJsPackageToNpmjsRegistry
```

一旦您將此檔案提交並推送到託管專案的 GitHub 存儲庫，
每當您在該存儲庫中建立 GitHub 版本 (release) 時，該工作流程就會執行。

> 您也可以將工作流程設定為[在推送標籤時觸發](https://stackoverflow.com/a/61892639)。
> 
{style="tip"}

### 設定 GitHub Actions 為您的受信任的發佈者

現在您已經發佈了工作流程，可以使用 GitHub Action 將[受信任的發佈者 (Trusted Publisher)](https://docs.npmjs.com/trusted-publishers) 新增到您的 npm 套件：

1. 開啟[已發佈的套件](#manual-publishing)頁面。
2. 開啟 **Settings** 分頁並找到 **Trusted Publisher** 區塊。
3. 在 **Select your publisher** 下，點擊 **GitHub Actions** 按鈕。
4. 填寫表單：
   * 您的 GitHub 名稱（或組織）
   * 存儲庫名稱
   * 工作流程檔案的名稱（在本教學中，我們使用了 [publish.yml](#create-a-github-actions-workflow-file)）。
5. 點擊 **Setup connection** 按鈕。

![為 GitHub Actions 設定 npm 受信任的發佈者](npm-trusted-publisher-github.png)

> [npm 不會驗證提供的座標](https://docs.npmjs.com/trusted-publishers#troubleshooting)，
> 因此請確保您輸入的詳細資訊正確無誤。
> 
{style="warning"}

建立的連線隨後會列在套件設定的 **Trusted Publishers** 區塊中，
這表示具有指定座標的工作流程現在已被授權發佈到 npm。

### 在 GitHub 上建立版本

設定好工作流程和受信任的發佈者連線後，您現在可以準備透過[建立 GitHub 版本](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release)來觸發發佈：

1. 將 `build.gradle.kts` 配置中的套件版本設定為您想要發佈的版本。

   > 如果版本號已被使用或低於已發佈的版本，npm 將不允許發佈。
   > 
   {style="note"}

2. 前往您的 GitHub 存儲庫。
3. 在右側欄中，點擊 **Releases**。
4. 點擊 **Draft a new release** 按鈕（如果您之前未曾為此存儲庫建立過版本，則點擊 **Create a new release** 按鈕）。
5. 建立或選擇一個 Git 標籤（如果可能，請與模組的版本相符，以保持各個系統間編號的一致性）。
6. 設定版本標題（將版本命名為與標籤相同是很方便的做法）。
   
   為了追蹤所有內容，您可能希望標籤中的版本與您在 `build.gradle.kts` 檔案中指定的程式庫版本號相同。

   ![在 GitHub 上建立版本](create-release-and-tag-for-npm.png){width=700}

7. 點擊 **Publish release** 按鈕。

要檢查 Action 是否被觸發，請點擊 GitHub 存儲庫頁面頂部的 **Actions** 分頁。
您應該會看到新發佈的版本觸發了發佈工作流程的執行。
點擊該工作流程以查看發佈任務的日誌。

當工作流程執行完成後，您套件的新版本應該會列在 npm 存儲庫的套件頁面中。

![透過 CI/CD 在 npm 上發佈的程式庫](published-second-version-on-npm.png){width=700}

## 下一步

* [將 shield.io 徽章新增到您的 README](https://shields.io/badges/npm-version)
* [使用 Dokka 產生 API 文件](https://kotl.in/dokka)
* [使用 Renovate 自動化相依性更新](https://docs.renovatebot.com/)
* [在 Kotlin Slack 中與社群分享您的程式庫](https://kotlinlang.slack.com/)
  （要註冊，請造訪 https://kotl.in/slack）