import sys, os, time
from playwright.sync_api import sync_playwright

def post_to_naver_blog(title, content):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=500)
        context = browser.new_context(viewport={'width': 1280, 'height': 900})
        page = context.new_page()

        # 1. 네이버 로그인
        print("[1/4] 네이버 로그인...")
        page.goto('https://nid.naver.com/nidlogin.login')
        page.wait_for_load_state('networkidle')
        time.sleep(2)

        naver_id = os.environ.get('NAVER_ID', '')
        naver_pw = os.environ.get('NAVER_PW', '')
        if naver_id and naver_pw:
            page.fill('#id', naver_id)
            time.sleep(0.3)
            page.fill('#pw', naver_pw)
            time.sleep(0.5)
            page.click('button[type="submit"]')
            page.wait_for_load_state('networkidle')

        print("캡차/2FA가 나오면 수동으로 완료해주세요. 최대 2분 대기합니다...")
        logged_in = False
        for i in range(120):
            time.sleep(1)
            url = page.url
            if 'nidlogin' not in url and 'nid.naver' not in url:
                logged_in = True
                break
            try:
                if not page.locator('#id').is_visible(timeout=500):
                    logged_in = True
                    break
            except:
                logged_in = True
                break
            if i % 15 == 14:
                print(f"  ... 대기 중 ({i+1}초)")

        if not logged_in:
            print("로그인 대기 시간 초과. 계속 진행합니다.")

        print("로그인 완료! 3초 대기...")
        time.sleep(3)

        # 2. 먼저 블로그 메인으로 이동해서 세션 확인
        print("[2/4] 블로그 페이지 이동...")
        page.goto('https://blog.naver.com/')
        page.wait_for_load_state('networkidle')
        time.sleep(3)

        # 3. 글쓰기 페이지
        print("[3/4] 글쓰기 페이지...")
        page.goto('https://blog.naver.com/PostWrite.naver')
        page.wait_for_load_state('networkidle')
        time.sleep(5)

        # 에디터 로딩 대기 - 제목 입력창이 나올 때까지
        try:
            page.wait_for_selector('#title', timeout=15000)
        except:
            # 로그인이 안 된 상태면 여기서 리다이렉트됨
            print("블로그 글쓰기 페이지 로딩 실패. 로그인 상태를 확인합니다.")
            print("현재 URL:", page.url)
            # 다시 로그인 시도
            if 'login' in page.url.lower():
                print("로그인이 필요합니다. 브라우저에서 로그인해주세요.")
                for i in range(120):
                    time.sleep(1)
                    if 'login' not in page.url.lower():
                        break
                page.goto('https://blog.naver.com/PostWrite.naver')
                page.wait_for_load_state('networkidle')
                time.sleep(5)
                page.wait_for_selector('#title', timeout=15000)

        # 4. 글 작성
        print("[4/4] 글 작성 중...")
        page.fill('#title', title)
        time.sleep(1)

        # 본문 입력
        content_selectors = [
            '.se-edit-container .se-section-text [contenteditable="true"]',
            '.se-edit-container [contenteditable="true"]',
            '[contenteditable="true"]',
        ]
        editor = None
        for sel in content_selectors:
            loc = page.locator(sel)
            if loc.count() > 0:
                editor = loc.first
                break

        if editor:
            editor.click()
            time.sleep(1)
            page.keyboard.type(content, delay=3)
            time.sleep(2)
        else:
            print("에디터를 찾지 못했습니다. 스크립트를 일시정지합니다.")
            print("수동으로 내용을 붙여넣고 발행해주세요.")
            print("60초 후 자동 종료됩니다.")
            time.sleep(60)
            browser.close()
            return

        # 발행
        print("발행 버튼 검색 중...")
        published = False
        for sel in ['.se-publish-btn', 'button.se-doc-publish-btn', '.btn_save']:
            btn = page.locator(sel)
            if btn.count() > 0:
                btn.first.click()
                published = True
                print("발행 버튼 클릭!")
                break

        if not published:
            for b in page.get_by_role('button').all():
                t = (b.text_content() or '').strip()
                if t in ['발행', '등록']:
                    b.click()
                    published = True
                    print(f"'{t}' 클릭!")
                    break

        if not published:
            print("발행 버튼을 찾지 못했습니다. 수동으로 발행해주세요.")

        print("\n10초 후 브라우저를 닫습니다. 확인하려면 브라우저를 보세요.")
        time.sleep(10)
        browser.close()
        print("완료!")

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print('Usage: python naver-blog-post.py "제목" "본문"')
        sys.exit(1)
    post_to_naver_blog(sys.argv[1], sys.argv[2])
