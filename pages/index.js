import React, { useState, useEffect } from 'react';
import {
  Button,
  Grid,
  Header,
  Container
} from 'semantic-ui-react';
import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';
import Page from '../components/page';
import Meta from '../components/Meta';
import CompanyCard from '../components/companyCard';
import StickyFooter from '../components/stickyFooter';
import FilterDropdown from '../components/filterDropdown';
import { shuffle, filterCompanies } from '../util/helpers';


const Home = ({ companies }) => {
  const router = useRouter();

  const [industry, setIndustry] = useState("All");
  const [filteredCos, setFilteredCos] = useState(companies);

  useEffect(() => {
    setIndustry(industry);
    setFilteredCos(filterCompanies(companies, industry))
  }, [industry])

  return (
    <div>
      <Meta
        title='Tech.Viet - A View into Vietnam Tech'
        desc='An open-source view into the Vietnam Tech ecosystem. Find tech companies of all sizes from Vietnam.'
        canonical='https://tech.viet.io/' />

      <Page>
        <Container style={{ minHeight: '100vh', width: '100vw', margin: '3em 0' }}>
          <Grid
            container
            stackable
            textAlign='center'
            verticalAlign='middle'>
            <Grid.Row style={{ minHeight: '50vh' }}>
              <Grid.Column>
                <Header
                  style={{ padding: '0.8em', fontSize: '3em', wordWrap: 'break-word' }}
                  content='An open-source view into the Vietnam Tech ecosystem' />
                <Button
                  style={{ margin: '0 1em' }}
                  color='teal'
                  content='Contribute'
                  size='big'
                  onClick={() => { router.push('/submit') }} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ padding: 0, margin: 0 }}>
              <Grid.Column>
                <FilterDropdown setIndustry={setIndustry} industry={industry} filteredLength={filteredCos.length} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                {filteredCos && filteredCos.length > 0 ?
                  filteredCos.map((company, id) =>
                    <CompanyCard
                      key={id}
                      company={company.data} />)
                  : <p style={{ fontSize: '2em', textAlign: 'center' }}>No companies!</p>}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Page>
      <StickyFooter />
    </div >
  )
}

export async function getStaticProps() {
  const companiesDirectory = path.join(process.cwd(), '/public/data/companies')
  const filenames = fs.readdirSync(companiesDirectory)

  const companies = filenames.map((filename) => {
    const filePath = path.join(companiesDirectory, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')

    return {
      filename,
      data: JSON.parse(fileContents),
    }
  })
  //Shuffle array of companies
  shuffle(companies);

  return {
    props: {
      companies
    },
  }
}

export default Home;
