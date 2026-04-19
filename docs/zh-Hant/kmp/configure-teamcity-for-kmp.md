# 為 Kotlin 多平台應用程式配置 TeamCity

<web-summary>了解如何為 Kotlin 多平台 (KMP) 配置 TeamCity Cloud 或地端專案。 
本教學使用支援即時 YAML 配置編輯和直觀視覺化編輯器的 TeamCity 管線。</web-summary>

本文說明如何配置 [TeamCity](https://www.jetbrains.com/teamcity/?source=google&medium=cpc&campaign=EMEA_en_DE_TeamCity_Branded&term=jetbrains%20teamcity&content=771411250243&gad_source=1&gad_campaignid=12704027475&gbraid=0AAAAADloJzi5LQxd_2GSPDer8jKk00xHY&gclid=CjwKCAjwyMnNBhBNEiwA-Kcgu9u9Gprgz8eDZs4p-aG14ZSEn3A3JARU_VXxZaEFPMrxGydCbvNJdxoCmToQAvD_BwE) 
以組建、測試及部署您的 KMP 應用程式。 
TeamCity 支援所有主要的版本控制系統提供者（GitHub、GitLab、Bitbucket、Azure DevOps、Perforce 等）， 
並透過本機和雲端代理實現高度可擴充的混合工作流，且包含強大的功能，例如 
高可用性的多節點設定、進階使用者管理、問題追蹤器整合以及 AI 助手。

在此獲取您的 [免費 TeamCity 試用版](https://www.jetbrains.com/teamcity/download/)： 
選擇 TeamCity Cloud 版本，其具備由 JetBrains 託管且預先配置了主要組建工具與 SDK 的代理； 
或者選擇 TeamCity On-Premises（地端）以獲得最大控制權和免費的永久 Professional 授權。

本教學基於 [JetCaster KMP 範例](https://github.com/kotlin-hands-on/jetcaster-kmp-migration/)。

## 建立新專案

每個 TeamCity 工作流都從一個專案開始。專案擁有組建組態和管線等實體， 
這些實體執行實際的 CI/CD 常式、儲存用於啟動雲端代理的雲端設定檔、與子物件共享參數等。

> 請參閱這些 TeamCity 文件文章以了解更多資訊：
> * [專案管理員指南](https://www.jetbrains.com/help/teamcity/project-administrator-guide.html#Steps%2C+Configurations+and+Projects)
> * [建立與編輯專案](https://www.jetbrains.com/help/teamcity/creating-and-editing-projects.html#Create+New+Projects+in+Kotlin+DSL)
>
{style="tip"}

1. 點擊側邊導覽列中的加號按鈕以啟動新專案。
2. 指定專案名稱，並根據需要提供描述。
3. 點擊 **Create** 後，TeamCity 將要求您選擇執行實際組建任務的物件類型： 
   組建組態或管線。

   <img src="teamcity-kmp-projectselector.png" width="500" alt="選擇組態或管線"/>

   <deflist type="medium">
   <def title="組建組態">
   支援 TeamCity 的完整功能，允許您將設定儲存為 Kotlin DSL 程式碼， 
   並提供無與倫比的自訂能力。然而，這可能需要更多的經驗和手動設定。

   了解更多：[建立與編輯組建組態](https://www.jetbrains.com/help/teamcity/creating-and-editing-build-configurations.html)。
   </def>
   <def title="管線">
   提供直觀的設計，具備視覺化編輯器、可編輯的 YAML 配置以及易於存取的設定。 
   管線是為經驗較少的使用者和較簡單的工作流設計的。
   管線於 TeamCity 2025.11 引入，目前缺少組建組態中可用的部分功能。

   了解更多：[建立與編輯管線](https://www.jetbrains.com/help/teamcity/create-and-edit-pipelines.html)。
   </def>
   </deflist>

   在本教學中，請選擇管線，因為它們更易於配置，並支援組建和測試我們範例專案所需的所有功能。

4. 選擇 **Connect new repository** 並選擇 **GitHub** 來建立可供未來專案重複使用的 GitHub 永久連線， 
   或選擇 **Any Git URL** 來與特定儲存庫進行有限連線 
   （範例 JetCaster 應用程式或您個人的 fork）。

5. 在 TeamCity 驗證其可以存取必要的儲存庫後，它會檢索有關分支的資訊，並要求您指定基本的管線行為。

   <img src="teamcity-kmp-pipelinesettings.png" width="450" alt="基本管線設定"/>

   保留預設設定，以允許管線追蹤所有儲存庫分支，使用 `main` 作為預設分支， 
   並在每次將變更提交到儲存庫時自動觸發新執行。

## 新增管線工作

管線準備就緒後，TeamCity 將導覽至其設定頁面。 
您可以使用左上角的切換開關在視覺化編輯器和程式碼編輯器之間切換。

<img src="teamcity-kmp-clientarea.png" width="450" alt="主要用戶端區域"/>

TeamCity 管線由工作 (job) 組成，這些工作是連續執行的建置步驟集合。 
建置步驟是 TeamCity 常式中封裝特定操作集的最小單位。

在 TeamCity UI 中，點擊工作方塊以編輯其設定，或點擊工作下方的深色區域 
以修改全域管線設定。

### 常見管線設定

本教學不需要設定任何全域管線選項。 
關於影響管線內所有工作的設定（例如以下各項），請參閱 [這篇文章](https://www.jetbrains.com/help/teamcity/pipeline-settings.html)：

* **Auto-run pipelines** — 允許您將管線配置為在每次有新變更 
  提交到遠端儲存庫（預設啟用）、在為儲存庫開啟提取要求時或按設定的排程自動執行。
* **Repository** — 允許您檢出並處理來自不同版本控制代管服務提供者的多個儲存庫。
* **Integrations** — 讓您連接外部 NPM 和 Docker 登錄。請注意，如果您計畫在公開的 Docker Hub 映像中執行建置步驟， 
  則不需要配置對應的整合， 
  除非您的管線執行頻率高到超過 Docker Hub 對匿名提取的速率限制。

### 代理設定

組建任務由安裝在實體機或雲端機器上的建置代理處理。 
這些機器必須安裝給定組建任務所需的所有工具。 
例如，此管線中的 Job 2 需要 Android SDK，而 Job 3 使用 Xcode 來組建 iOS 版本的應用程式。

* TeamCity Cloud 使用由 JetBrains 託管且 [配備了廣泛組建工具](https://www.jetbrains.com/help/teamcity/cloud/jetbrains-hosted-agents.html#Agent+Software) 的代理。 
  在本教學中，您不需要連接任何額外的代理。
* 如果您使用的是 TeamCity On-Premises，則需要確保每個工作都可以在至少一個代理上執行。 
  有關更多詳細資訊，請參閱本文：[安裝並啟動 TeamCity 代理](https://www.jetbrains.com/help/teamcity/install-and-start-teamcity-agents.html)。

在本教學中，工作指定了代理需求，以保證它們僅被分配給安裝了必要工具的代理。

### 執行共享測試

切換到 YAML 管線編輯器並貼上以下標記以設定第一個工作：

```yaml
jobs:
  Job1:
    name: Run tests
    steps:
      - type: gradle
        use-gradle-wrapper: true
        name: Gradle test
        jdk-home: '%\env.JDK_17_0%'
        tasks: jvmTest
    files-publication:
      - path: '**/build/reports/tests/**/*'
        share-with-jobs: false
        publish-artifact: true
    allow-reuse: false
```

此工作使用 Java 17 執行 `jvmTest` Gradle 任務。它收集所有路徑符合 `.../build/reports/tests/...` 的檔案， 
將它們歸類在 `test-reports` 資料夾下，並將此資料夾發佈為建置產物。

您還可以啟用 **Optimizations | Parallel tests** 工作選項，將測試套件拆分為較小的 
批次，並在不同的建置代理上處理每個批次。 
這可以顯著縮短總執行時間，但會消耗更多資源。
要啟用平行測試，請修改管線 YAML 以包含 `parallelism` 設定，如下所示：

```yaml
    ...
    allow-reuse: false
    parallelism: 3
```

**Allow reuse** 優化選項指定當管線配置或原始碼未發生變更時，TeamCity 是否應跳過重新執行任務。

如需更多資訊，請參閱 [工作設定](https://www.jetbrains.com/help/teamcity/job-settings.html) 
和 [Gradle 建置步驟](https://www.jetbrains.com/help/teamcity/gradle.html)。

### 組建 Android 除錯套件

按如下方式修改管線 YAML：

```yaml
jobs:
  Job1:
    name: Run tests
    ...
    Job2:
      name: Build Android
      steps:
        - type: gradle
          jdk-home: '%\env.JDK_17_0%'
          tasks: ':mobile:assembleDebug'
          use-gradle-wrapper: true
      files-publication:
        - path: mobile/build/outputs/apk/debug/*.apk
          share-with-jobs: false
          publish-artifact: true
      runs-on:
        self-hosted:
          - requirement: exists
            name: Android home
            parameter: env.ANDROID_HOME
      dependencies:
        - Job1
```

* `requirement` 區塊確保此工作僅會分配給安裝了 Android SDK 的代理。 
* `dependencies` 區段保證此工作僅在 `Job1` 成功完成後才會啟動。

### 組建 iOS 模擬器應用程式

對於最後一步，請將以下標記新增到管線 YAML：

```yaml
jobs:
  Job1:
    ...
  Job2:
    ...
  Job3:
    name: Build iOS
    steps:
      - type: script
        script-content: |-
          xcodebuild build \
            -project JetcasterMigration/JetcasterMigration.xcodeproj \
            -configuration Debug \
            -scheme JetcasterMigration \
            -sdk iphonesimulator \
            -derivedDataPath ./build \
            -verbose
    files-publication:
      - path: build/Build/Products/Debug-iphonesimulator/**/*
        share-with-jobs: false
        publish-artifact: true
    dependencies:
      - Job1
```

與前兩個工作不同，**Build iOS** 使用通用的 [命令列建置步驟](https://www.jetbrains.com/help/teamcity/command-line.html)， 
這允許您執行指令或與安裝在代理機器上的任何工具進行互動。

`dependencies` 區段指定了對 `Job1` 的相依性，這意味著 **Build Android** 和 **Build iOS** 工作可以平行執行， 
但僅在 `Job1` 的測試常式完成後才會啟動。

> 在處理組建組態時，您可以用專門的 [Xcode 專案步驟](https://www.jetbrains.com/help/teamcity/xcode-project.html) 取代 Script 建置步驟。
>
{style="tip"}

## 執行管線

點擊右上角的 **Save and Run** 以啟動您的工作流。 
工作完成後，它發佈的任何建置產物都可以在建置日誌旁邊的 **Artifacts** 分頁中找到。

<img src="teamcity-kmp-artifacts.png" alt="TeamCity 建置產物" width="450"/>

`Job1` 還將顯示一個 **Tests** 分頁，讓您檢查測試結果。

<img src="teamcity-kmp-tests.png" alt="TeamCity 測試" width="450"/>

## 下一步

您可以繼續修改此範例以獲得更多好處：

* **使用 VCS 連線新增管線**
 
  當 [向專案新增新管線](#create-a-new-project) 時，選擇 **GitHub** 而不是 **Any Git URL**。 
  這種方法不僅讓您可以跳過為未來的 GitHub 專案配置 VCS 存取權限， 
  還能解鎖額外的管線功能：

    * TeamCity 可以直接向 GitHub [發佈執行狀態](https://www.jetbrains.com/help/teamcity/create-and-edit-pipelines.html#Publish+Run+Statuses+to+VCS)（成功、失敗或執行中）。
    * [**On new changes** 觸發器](https://www.jetbrains.com/help/teamcity/pipeline-settings.html#On+New+Changes) 和 [**Repository** 項目](https://www.jetbrains.com/help/teamcity/pipeline-settings.html#Repository) 將包含一個 **Pull requests** 切換開關，
      允許您追蹤並組建尚未提交到穩定分支的變更。

* **探索進階組建組態**

  從管線切換到 [組建組態](https://www.jetbrains.com/help/teamcity/configuring-general-settings.html) 以存取進階功能：

    * 使用 [建置鏈](https://www.jetbrains.com/help/teamcity/build-chain.html) 和 [複合組態](https://www.jetbrains.com/help/teamcity/composite-build-configuration.html) 來執行工作流的特定部分。 
      例如，僅執行 **Test &rarr; Build iOS** 而不觸發 **Build Android**，或者單獨執行測試組態。
    * 享有由 JetBrains 打造的完整建置步驟、社群配方以及未綑綁的步驟，如 [GitHub 發佈](https://blog.jetbrains.com/teamcity/2025/09/teamcity-github-releases-plugin/)。
    * 在 [Kubernetes 叢集中部署您的代理](https://www.jetbrains.com/help/teamcity/setting-up-teamcity-for-kubernetes.html)，或者將其用作 [外部執行器](https://www.jetbrains.com/help/teamcity/kubernetes-executor.html)。
    * 設定與 [問題追蹤器](https://www.jetbrains.com/help/teamcity/integrating-teamcity-with-issue-tracker.html) 和 [秘密金鑰庫 (Vault)](https://www.jetbrains.com/help/teamcity/hashicorp-vault.html) 的整合。